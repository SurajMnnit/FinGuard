import prisma from '../config/prisma';

export const getDashboardAnalytics = async (userId: number, role: string) => {
    const isPrivileged = role === 'ADMIN' || role === 'ANALYST';
    const whereClause = isPrivileged ? {} : { userId };

    // 1. Total Income & Total Expense
    const aggregations = await prisma.record.groupBy({
        by: ['type'],
        where: whereClause,
        _sum: {
            amount: true,
        },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    aggregations.forEach((agg: any) => {
        if (agg.type === 'INCOME') totalIncome = agg._sum.amount || 0;
        if (agg.type === 'EXPENSE') totalExpense = agg._sum.amount || 0;
    });

    const netBalance = totalIncome - totalExpense;

    // 2. Category-wise Totals
    const categoryTotals = await prisma.record.groupBy({
        by: ['category', 'type'],
        where: whereClause,
        _sum: {
            amount: true,
        },
        orderBy: {
            _sum: {
                amount: 'desc',
            },
        },
    });

    const categoryData = categoryTotals.map((cat: any) => ({
        category: cat.category,
        type: cat.type,
        total: cat._sum.amount || 0,
    }));

    // 3. Monthly Trends (Using raw query for date formatting)
    let monthlyTrends: any[] = [];
    try {
        if (isPrivileged) {
            monthlyTrends = await prisma.$queryRaw<any[]>`
                SELECT 
                  TO_CHAR("date", 'YYYY-MM') as month, 
                  "type", 
                  SUM("amount") as total
                FROM "Record"
                GROUP BY TO_CHAR("date", 'YYYY-MM'), "type"
                ORDER BY month ASC
            `;
        } else {
            monthlyTrends = await prisma.$queryRaw<any[]>`
                SELECT 
                  TO_CHAR("date", 'YYYY-MM') as month, 
                  "type", 
                  SUM("amount") as total
                FROM "Record"
                WHERE "userId" = ${userId}
                GROUP BY TO_CHAR("date", 'YYYY-MM'), "type"
                ORDER BY month ASC
            `;
        }
        // Parse BigInt to Number — prisma.$queryRaw may return BigInt for SUM
        monthlyTrends = monthlyTrends.map((trend: any) => ({
            ...trend,
            total: Number(trend.total),
        }));
    } catch (error) {
        console.error('Error fetching monthly trends:', error);
    }

    // 4. Recent Transactions
    let recentTransactions;
    if (isPrivileged) {
        recentTransactions = await prisma.record.findMany({
            where: whereClause,
            orderBy: { date: 'desc' },
            take: 5,
            include: { user: { select: { id: true, name: true } } },
        });
    } else {
        recentTransactions = await prisma.record.findMany({
            where: whereClause,
            orderBy: { date: 'desc' },
            take: 5,
        });
    }

    return {
        overview: {
            totalIncome,
            totalExpense,
            netBalance,
        },
        categoryData,
        monthlyTrends,
        recentTransactions,
    };
};

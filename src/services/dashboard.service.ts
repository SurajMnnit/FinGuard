import prisma from '../config/prisma';

export const getSummary = async (userId: number, role: string) => {
    const isPrivileged = role === 'ADMIN' || role === 'ANALYST';
    const whereClause = isPrivileged ? {} : { userId };

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

    return {
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense,
    };
};

export const getCategoryTotals = async (userId: number, role: string) => {
    const isPrivileged = role === 'ADMIN' || role === 'ANALYST';
    const whereClause = isPrivileged ? {} : { userId };

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

    return categoryTotals.map((cat: any) => ({
        category: cat.category,
        type: cat.type,
        total: cat._sum.amount || 0,
    }));
};

export const getMonthlyTrends = async (userId: number, role: string) => {
    const isPrivileged = role === 'ADMIN' || role === 'ANALYST';
    
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
        return monthlyTrends.map((trend: any) => ({
            ...trend,
            total: Number(trend.total),
        }));
    } catch (error) {
        console.error('Error fetching monthly trends:', error);
        return [];
    }
};

export const getRecentTransactions = async (userId: number, role: string) => {
    const isPrivileged = role === 'ADMIN' || role === 'ANALYST';
    const whereClause = isPrivileged ? {} : { userId };

    return prisma.record.findMany({
        where: whereClause,
        orderBy: { date: 'desc' },
        take: 5,
        include: isPrivileged ? { user: { select: { id: true, name: true } } } : undefined,
    });
};

export const getDashboardAnalytics = async (userId: number, role: string) => {
    const [summary, categoryData, monthlyTrends, recentTransactions] = await Promise.all([
        getSummary(userId, role),
        getCategoryTotals(userId, role),
        getMonthlyTrends(userId, role),
        getRecentTransactions(userId, role),
    ]);

    return {
        overview: summary,
        categoryData,
        monthlyTrends,
        recentTransactions,
    };
};

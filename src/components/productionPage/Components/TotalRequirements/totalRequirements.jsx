import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = {
    produced: '#4A90E2',   // Blue
    remaining: '#FF5C5C',  // Red
    overflow: '#003E7E',   // Darker Blue
};

export const TotalRequirements = ({ prodData, goalData }) => {
    const totalProduced = prodData?.reduce((sum, item) => sum + (item.Quantity || 0), 0) || 0;
    const totalGoal = goalData ? Object.values(goalData).reduce((sum, val) => sum + val, 0) : 0;

    let chartData = [];

    if (totalProduced <= totalGoal) {
        chartData = [
            { name: 'Produced', value: totalProduced, color: COLORS.produced },
            { name: 'Remaining', value: totalGoal - totalProduced, color: COLORS.remaining },
        ];
    } else {
        chartData = [
            { name: 'Goal Met', value: totalGoal, color: COLORS.produced },
            { name: 'Overflow', value: totalProduced - totalGoal, color: COLORS.overflow },
        ];
    }

    return (
        <PieChart width={200} height={200}>
            <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
            >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    );
};

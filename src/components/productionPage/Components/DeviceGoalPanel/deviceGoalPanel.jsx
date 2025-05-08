import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import "./DeviceGoalPanel.css";

const COLORS = {
    produced: '#4A90E2',
    remaining: '#FF5C5C',
    overflow: '#003E7E',
};

export const DeviceGoalPanel = ({ prodData, goalData }) => {
    if (!prodData || !goalData) return null;

    // Group production by device
    const productionByDevice = {};
    prodData.forEach(item => {
        const device = item.Device || "Unknown";
        productionByDevice[device] = (productionByDevice[device] || 0) + (item.Quantity || 0);
    });

    // Generate chart blocks
    const chartBlocks = Object.entries(goalData).map(([device, goal]) => {
        if (!goal) return null;

        const produced = productionByDevice[device] || 0;

        const chartData = produced <= goal
            ? [
                { name: 'Produced', value: produced, color: COLORS.produced },
                { name: 'Remaining', value: goal - produced, color: COLORS.remaining },
              ]
            : [
                { name: 'Goal Met', value: goal, color: COLORS.produced },
                { name: 'Overflow', value: produced - goal, color: COLORS.overflow },
              ];

        return (
            <div className="square-bubble devices" key={device}>
                <h4>{device}</h4>
                <PieChart
                    width={120}
                    height={120}
                    style={{ Height: '20rem', Width: '20rem' }}
                >
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={40}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                    >
                        {chartData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />

                </PieChart>
            </div>
        );
    }).filter(Boolean);

    return (
        <div className='internal-device-goal-container'>
            {chartBlocks}
        </div>
    );
};

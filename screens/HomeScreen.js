import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';

// Helper functions for drawing the progress arc
const polarToCartesian = (cx, cy, r, angle) => {
    const rad = (Math.PI * (angle - 90)) / 180.0;
    return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad),
    };
};

const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    const d = [
        'M', start.x, start.y,
        'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    ].join(' ');
    return d;
};

const HomeScreen = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [value, setValue] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const newValue = Math.floor(Math.random() * 100); // Simulated random value between 0 and 100
            setData((prevData) => {
                const updatedData = [...prevData, newValue];
                return updatedData.length > 10 ? updatedData.slice(-10) : updatedData;
            });
            setValue(newValue);
        }, 1000); // Update every second

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const chartData = {
        labels: data.map((_, index) => (index + 1).toString()),
        datasets: [
            {
                data: data,
                strokeWidth: 5,
                color: () => 'rgba(154, 82, 255, 1)',
            },
        ],
    };

    const chartConfig = {
        backgroundColor: '#f0f4f8',
        backgroundGradientFrom: '#f0f4f8',
        backgroundGradientTo: '#f0f4f8',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        propsForDots: {
            r: '3',
            strokeWidth: '2',
            stroke: '#fff',
        },
        propsForBackgroundLines: {
            stroke: 'rgba(0, 0, 0, 0)',
        },
        fillShadowGradient: 'rgba(154, 82, 255, 1)', 
        fillShadowGradientOpacity: 0.2, 
    };

    // Determine status based on the gas level value
    let status;
    if (value < 30) {
        status = 'Normal';
    } else if (value >= 30 && value <= 70) {
        status = 'Warning';
    } else {
        status = 'Danger';
    }

    const statusColor = status === 'Normal' ? '#ba63ff' : status === 'Warning' ? '#af5dff' : '#9a52ff';

    const radius = 40;
    const strokeWidth = 10;
    const maxAngle = 252; // Maximum angle for 70% of the circle
    const arcLength = (value / 100) * maxAngle;

    return (
        <View style={styles.container}>
            {/* Back Button and Analytics Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Onboarding')}>
                    <Icon name="chevron-back" size={30} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Analytics</Text>
            </View>

            {/* Gas Analytics Progress and Status */}
            <View style={styles.progressContainer}>
                <Svg height="300" width="300" viewBox="0 0 100 100">
                    {/* Background Circle (70%) */}
                    <Path
                        d={describeArc(50, 50, radius, -126, 126)} // From -126° to 126° to represent 70% of a circle
                        stroke="#d6d6d6"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    {/* Progress Arc (Dynamic for 70%) */}
                    <Path
                        d={describeArc(50, 50, radius, -126, -126 + arcLength)} // Calculate arc based on value
                        stroke={statusColor}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeLinecap="round"
                    />
                </Svg>

                {/* Percentage inside circle */}
                <View style={styles.centerTextContainer}>
                    <Text style={[styles.progressText, { color: statusColor }]}>{`${value}%`}</Text>
                </View>

                <View style={styles.statusOverlay}>
                    <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
                </View>
            </View>

            {/* Line Chart */}
            <View style={styles.chartBox}>
                <Text style={styles.chartLabel}>Overview</Text>
                <View style={styles.chartContainer}>
                    {data.length > 0 ? (
                        <LineChart
                            data={chartData}
                            width={Dimensions.get('window').width - 0} // from react-native
                            height={300}
                            chartConfig={chartConfig}
                            bezier
                            style={styles.chartStyle}
                        />
                    ) : (
                        <Text>No data available</Text>
                    )}
                </View>
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(177, 136, 239, 0.2)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 50,
        marginTop: 120,
    },
    title: {
        fontSize: 18,
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    progressContainer: {
        position: 'relative',
        width: 300,
        height: 300,
        marginBottom: 20,
    },
    centerTextContainer: {
        position: 'absolute',
        top: '50%',
        left: '52%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
    },
    progressText: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    statusOverlay: {
        position: 'absolute',
        top: '70%',
        left: '55%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
    },
    statusText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    chartBox: {
        backgroundColor: '#f0f4f8',
        bottom: '4%',
        width: '100%',
        paddingBottom: 300,
        borderRadius: 40,
        // iOS shadow properties
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        // Android elevation property
        elevation: 8,
    },
    chartContainer: {
        width: '100%',
        height: '25%',
        top: '120%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartStyle: {
        marginVertical: 8,
        borderRadius: 16,
    },
    chartLabel: {
        top: '20%',
        left: '10%',
        fontSize: 24,
        fontWeight: 'bold'
    }
});

export default HomeScreen;

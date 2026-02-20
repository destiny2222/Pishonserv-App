import React from "react";
import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface EarningsChartCardProps {
  totalEarnings?: number;
  chartData?: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
}

const EarningsChartCard = ({ totalEarnings, chartData }: EarningsChartCardProps) => {
  const screenWidth = Dimensions.get('screen').width;
  const chartWidth = screenWidth - 60;

  const defaultData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{ data: [0, 0, 0, 0, 0, 0] }],
  };

  const data = chartData && chartData.labels.length > 0 ? chartData : defaultData;

  return (
    <View className="bg-white rounded-2xl shadow-sm p-4 mb-5">
      <View className="flex-row justify-between items-center">
        <Text className="font-poppins-semibold text-base text-black">
          Total Earnings{" "}
          <Text className="font-poppins-light text-gray-500">(Last 6 months)</Text>
        </Text>
        {totalEarnings !== undefined && (
          <Text className="font-poppins-semibold text-base text-primary">
            N{totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        )}
      </View>
      <LineChart
        data={data}
        width={chartWidth}
        height={230}
        fromZero
        yAxisSuffix="k"
        yAxisInterval={1}
        withShadow={false}
        withInnerLines
        withOuterLines={false}
        withVerticalLines={false}
        bezier={true}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(201, 162, 74, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
          propsForBackgroundLines: {
            stroke: "#E5E7EB",
            strokeDasharray: "",
          },
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "rgba(201, 162, 74, 1)",
          },
        }}
        style={{
          marginTop: 10,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

export default EarningsChartCard;

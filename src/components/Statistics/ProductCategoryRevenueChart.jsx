import React from 'react';
import { Bar } from 'react-chartjs-2';

const ProductCategoryRevenueChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.categoryName),
    datasets: [
      {
        label: 'Doanh thu',
        data: data.map(item => item.revenue),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Doanh thu theo danh mục sản phẩm'
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default ProductCategoryRevenueChart;
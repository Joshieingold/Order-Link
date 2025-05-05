import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './orderStatistics.css';
import "../../General/General.css";
import { fetchOrdersData } from '../../General/database/databaseFunctions.jsx';
import OptChart from './Components/OrdersPerTechChart/optChart.jsx';
import DptChart from "./Components/DevicesPerTechChart/dptChart.jsx";
import WaybillTreemap from './Components/OrdersTreeMap/OrdersTreeMap.jsx';
import { Navbar } from '../../General/navbar/navbar.jsx';
import OrdersNavbar from './components/ordersNavbar/ordersNavbar.jsx';
import TotalDevicesPieChart from './components/TotalDevicesPieChart/totalDevicesPieChart.jsx';
import DevicesPerLocationChart from './components/DevicesPerLocationChart/devicesPerLocationChart.jsx';
import OrdersPerDayChart from './components/OrdersPerDayChart/OrdersPerDayChart.jsx';
import { EstimateCosts } from './components/EstimateCosts/estimateCosts.jsx';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// ChartWrapper component for conditional rendering
const ChartWrapper = ({ data, loading, children }) => {
  if (loading) return <p>Loading chart...</p>;
  if (!data || data.length === 0) return <p className='empty-bubble'>No data available</p>;
  return children;
};

const OrderStatisticsPage = () => {
  // Set current month date range
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const locationOptions = [
    { value: 'Saint John', label: 'Saint John' },
    { value: 'Fredericton', label: 'Fredericton' },
    { value: 'Moncton', label: 'Moncton' },
    { value: 'Purolator', label: 'Purolator (Other)' },
    { value: 'Contractor', label: 'Contractor (DHT/NF)' },
  ];

  const defaultLocations = locationOptions.filter(opt => opt.value !== 'Contractor');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(defaultLocations);
  const [dateRange, setDateRange] = useState([firstDayOfMonth, lastDayOfMonth]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersData = await fetchOrdersData();
        setData(ordersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleResetFilters = () => {
    setSelectedLocation(defaultLocations);
    setDateRange([firstDayOfMonth, lastDayOfMonth]);
  };

  const filteredData = selectedLocation.length > 0
    ? data?.filter((item) => {
        const tech = item['Technician']?.toLowerCase() || '';
        const waybill = item['Waybill'] || '';
        const loc = item['Location']?.toLowerCase() || '';

        return selectedLocation.some(({ value }) => {
          switch (value) {
            case 'Saint John':
              return loc.includes('saint john');
            case 'Fredericton':
              return loc.includes('fredericton');
            case 'Moncton':
              return loc.includes('moncton');
            case 'Purolator':
              return /^\d+$/.test(waybill);
            case 'Contractor':
              return tech.includes('dht') || tech.includes('nf');
            default:
              return false;
          }
        });
      })
    : data;

  const filteredDataByDate = filteredData?.filter((item) => {
    const orderDate = new Date(item['Date']);
    return (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate);
  });

  return (
    <motion.div className='order-statistics-page' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
      <Navbar />
      <OrdersNavbar />
      <div className='top-components'>
        <h1 className='main-title-text'>Orders Dashboard</h1>

        <div className="query-container">
          <Select
            options={locationOptions}
            placeholder="Filter by location(s)"
            value={selectedLocation}
            onChange={setSelectedLocation}
            isMulti
            isClearable={true}
            className="location-select"
            classNamePrefix="select"
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: '#1e1e1e',
                color: '#fff',
                borderColor: state.isFocused ? '#555' : '#333',
                boxShadow: 'none',
                '&:hover': { borderColor: '#777' },
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: '#2c2c2c',
                color: '#fff',
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused
                  ? '#444'
                  : state.isSelected
                  ? '#555'
                  : '#2c2c2c',
                color: '#fff',
                '&:active': { backgroundColor: '#666' },
              }),
              multiValue: (base) => ({ ...base, backgroundColor: '#333' }),
              multiValueLabel: (base) => ({ ...base, color: '#fff' }),
              multiValueRemove: (base) => ({
                ...base,
                color: '#aaa',
                ':hover': { backgroundColor: '#555', color: '#fff' },
              }),
              input: (base) => ({ ...base, color: '#fff' }),
              placeholder: (base) => ({ ...base, color: '#aaa' }),
              singleValue: (base) => ({ ...base, color: '#fff' }),
            }}
          />

          <div className="date-picker-container">
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              isClearable
              placeholderText="Filter by date range"
              dateFormat="yyyy-MM-dd"
              className="date-picker"
              monthsShown={1}
              popperPlacement="bottom-start"
            />
          </div>

          <button className="reset-button" onClick={handleResetFilters}>
            Reset Filters
          </button>
        </div>
      </div>

      <div className='chart-section'>
        <div className='bubble-container top'>
          <div className='rectangle-bubble'>
            <ChartWrapper data={filteredDataByDate} loading={loading}>
              <OrdersPerDayChart data={filteredDataByDate} />
            </ChartWrapper>
          </div>
          <div className='square-bubble'>
            <ChartWrapper data={filteredDataByDate} loading={loading}>
              <DevicesPerLocationChart data={filteredDataByDate} />
            </ChartWrapper>
          </div>
          <div className='square-bubble'>
            <ChartWrapper data={filteredDataByDate} loading={loading}>
              <TotalDevicesPieChart data={filteredDataByDate} />
            </ChartWrapper>
          </div>
        </div>

        <div className='bubble-container'>
          <div className='square-bubble'>
            <ChartWrapper data={filteredDataByDate} loading={loading}>
              <EstimateCosts data={filteredDataByDate} />
            </ChartWrapper>
          </div>
          <div className='square-bubble'>
            <ChartWrapper data={filteredDataByDate} loading={loading}>
              <OptChart data={filteredDataByDate} />
            </ChartWrapper>
          </div>
          <div className='square-bubble'>
            <ChartWrapper data={filteredDataByDate} loading={loading}>
              <DptChart data={filteredDataByDate} />
            </ChartWrapper>
          </div>
          <div className='rectangle-bubble'>
            <ChartWrapper data={filteredDataByDate} loading={loading}>
              <WaybillTreemap data={filteredDataByDate} />
            </ChartWrapper>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderStatisticsPage;

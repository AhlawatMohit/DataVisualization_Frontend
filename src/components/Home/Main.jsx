import { useEffect, useState } from 'react'
import axios from 'axios'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line, Doughnut, Bar } from 'react-chartjs-2'


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);


// Local Backend-URL
// const Backend_url = "http://localhost:PORT";

// Deployed Backend URL
const Backend_url = "https://data-visualization-backend-pi.vercel.app"


// Graph Color
const backgroundColor = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)',
]
const borderColor = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)',
]



const Main = () => {

  const [jsonData, setJsonData] = useState([]);
  const [topic, setTopic] = useState({});
  const [sector, setSector] = useState({});
  const [likelihood, setLikelihood] = useState({});
  const [filteredData, setFilteredData] = useState(jsonData);
  const [filters, setFilters] = useState({ sector: '', topic: '', insight: '', region: '', country: '' });
  const [isHighlighted, setHighlighted] = useState(false);

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Likelihood',
      },
    },
  };
  const options2 = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Topic',
      },
    },
  };
  const options3 = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sector',
      },
    },
  };


  const chartData = {
    labels: Object.keys(likelihood).map(Number),
    datasets: [{
      fill: true,
      label: 'Likelihood',
      data: Object.values(likelihood),
      backgroundColor,
      borderColor,
      borderWidth: 1,
    }]
  };

  const chartData2 = {
    labels: Object.keys(topic).map(String),
    datasets: [{
      fill: true,
      label: 'Total Count',
      data: Object.values(topic),
      backgroundColor,
      borderColor,
      borderWidth: 1,
    }]
  };

  const chartData3 = {
    labels: Object.keys(sector).map(String),
    datasets: [{
      fill: false,
      label: 'Total No. of Sector',
      tension: 0.3,
      data: Object.values(sector).map(Number),
      backgroundColor,
      borderColor,
      borderWidth: 1,
    }]
  };


  // Get data from backend
  const getAllData = async () => {
    try {
      const response = await axios.get(Backend_url + "/allData")
      console.log(response.data);
      setJsonData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const getTopic = async () => {
    try {
      const response = await axios.get(Backend_url + "/topic")
      console.log(response.data);
      setTopic(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const getSector = async () => {
    try {
      const response = await axios.get(Backend_url + "/sector")
      console.log(response.data);
      setSector(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const getLikelihood = async () => {
    try {
      const response = await axios.get(Backend_url + "/likelihood")
      console.log(response.data);
      setLikelihood(response.data);
    } catch (error) {
      console.log(error);
    }
  }


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };


  // Show and Hide Data Handler
  const handleChange = () => {
    setHighlighted(!isHighlighted);
  }


    // Call all functions
    useEffect(() => {
      getAllData();
      getTopic();
      getSector();
      getLikelihood();
    }, []);



  // Filter data
  useEffect(() => {
    let filtered = jsonData.filter((item) => {
      let isValid = true;
      for (const [key, value] of Object.entries(filters)) {
        if (value !== "" && item[key]?.toLowerCase() !== value?.toLowerCase()) {
          isValid = false;
          break;
        }
      }
      return isValid;
    });
    setFilteredData(filtered);
  }, [filters]);



  return (
    <>
      <div className='w-screen h-auto bg-[#35374B]'>
        <div className='flex flex-col justify-center items-center'>
          <div className='my-10'>
            <div className='w-64 h-64 ml-52'>
              <Doughnut data={chartData} options={options} />
            </div>
            <div className='2xl:w-[30rem] 2xl:h-[20rem] md:w-[30rem] md:h-[15rem] md:ml-24 sm:w-[21rem] sm:h-[10rem] sm:ml-[10rem] xl:ml-36'>
              <Line data={chartData2} options={options2} />
            </div>
            <div className='xl:w-[40rem] xl:h-[30rem] md:w-[30rem] md:h-[20rem] xl:ml-36'>
              <Bar data={chartData3} options={options3} />
            </div>
          </div>
        </div>


        <div className='flex flex-col justify-center items-center'>
          <div className='text-2xl text-[#59D5E0] my-5'>All Data <span className='text-[#387ADF]'>/</span> Filtered Data</div>
          <div className='flex justify-center items-center'>
            <div className='m-2'>
              <label className='text-sm mr-2'>Topic</label>
              <input className='w-48 h-6 rounded ml-1' type="text" name="topic" value={filters.topic} onChange={handleFilterChange} />
            </div>
            <div className='m-2'>
              <label className='text-sm mr-2'>Sector</label>
              <input className='w-48 h-6 rounded ml-1' type="text" name="sector" value={filters.sector} onChange={handleFilterChange} />
            </div>
            <div className='m-2'>
              <label className='text-sm mr-2'>Region</label>
              <input className='w-48 h-6 rounded ml-1' type="text" name="region" value={filters.region} onChange={handleFilterChange} />
            </div>
            <div className='m-2'>
              <label className='text-sm mr-2'>Insight</label>
              <input className='w-48 h-6 rounded ml-1' type="text" name="pestle" value={filters.insight} onChange={handleFilterChange} />
            </div>
            <div className='m-2'>
              <label className='text-sm mr-2'>Country</label>
              <input className='w-48 h-6 rounded ml-1' type="text" name="country" value={filters.country} onChange={handleFilterChange} />
            </div>
          </div>
        </div>

        <span className='text-[#59D5E0] m-2'>Total No. of Card / Data : {filteredData.length}</span>
        <div>
          <button onClick={handleChange} className='border-2 rounded-lg border-solid hover:border-[#50C4ED] py-2 px-4 m-5 bg-[#416D19] hover:bg-[#9BCF53] text-white hover:text-[#000]'>Show All Data</button>
        </div>
        <div className={`flex flex-col justify-center items-center ${isHighlighted ? 'hidden' : 'block'}`}>
          {filteredData.map((item, index) => (
            <div key={index} className='border-2 rounded-lg text-white mx-auto w-fit h-fit p-10 m-4'>
              <p className="">Topic : {item.topic}</p>
              <p className="">Sector : {item.sector}</p>
              <p className="">Region : {item.region}</p>
              <p className="">Insight : {item.insight}</p>
              <p className="">Country : {item.country}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Main
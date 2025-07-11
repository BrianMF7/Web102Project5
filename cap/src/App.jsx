import './App.css'
import APIForm from './components/APIForm';
import Gallery from './components/Gallery';
import { useState } from 'react';

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [inputs, setInputs] = useState({
    url: "",
    format: "",
    no_ads: "",
    no_cookie_banners: "",
    width: "",
    height: "",
  });
  
     const [currentImage, setCurrentImage] = useState(null);
     const [prevImages, setPrevImages] = useState([]);
        const [quota, setQuota] = useState({
    limit: null,
       remaining: null,
    reset: null
            });

  const reset = () => {
    setInputs({
      url: "",
      format: "",
      no_ads: "",
      no_cookie_banners: "",
      width: "",
      height: "",
    });};

  const callAPI = async (query) => {
    const response = await fetch(query);
               const json = await response.json();


    if (json.url) {
      setCurrentImage(json.url);
        setPrevImages((images) => [...images, json.url]);
      reset();
      getQuota();
         } else {
      setCurrentImage(json.url);
       setPrevImages((images) => [...images, json.url]);
         reset();
      getQuota()
    }
              };

        const makeQuery = () => {
    let wait_until = "network_idle";
       let response_type = "json";
         let fail_on_status = "400%2C404%2C500-511";
    let url_starter = "https://";
    let fullURL = url_starter + inputs.url;
    
         let query = `https://api.apiflash.com/v1/urltoimage?access_key=${ACCESS_KEY}&url=${fullURL}&format=${inputs.format}&width=${inputs.width}&height=${inputs.height}&no_cookie_banners=${inputs.no_cookie_banners}&no_ads=${inputs.no_ads}&wait_until=${wait_until}&response_type=${response_type}&fail_on_status=${fail_on_status}`;
    
    callAPI(query).catch(console.error);
  };

            const submitForm = () => {
    let defaultValues = {
      format: "jpeg",
  no_ads: "true",
         no_cookie_banners: "true",
      width: "1920",
      height: "1080",
          };
    
    if (inputs.url === "") {
      alert("You forgot to submit a URL!");
    } else {
      for (const [key, value] of Object.entries(inputs)) {
        if (value == "") {
          inputs[key] = defaultValues[key];
        }  }
      makeQuery();
    }};

  const getQuota = async () => {
    try {
      const response = await fetch(`https://api.apiflash.com/v1/urltoimage/quota?access_key=${ACCESS_KEY}`);
             const json = await response.json();
      setQuota({
        limit: json.limit,
        remaining: json.remaining,
           reset: json.reset
      });
    } catch (error) {
      console.error("Error fetching quota:", error);
    } };

                        return (
    <div className="whole-page">
      <h1>Build Your Own Screenshot! 📸</h1>
      
         <APIForm
        inputs={inputs}
        handleChange={(e) =>
          setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value.trim(),
          }))
        }
        onSubmit={submitForm}
      />
      <br></br>
      
           {currentImage ? (
        <img
              className="screenshot"
          src={currentImage}
            alt="Screenshot returned"
        />
                ) : (
        <div> </div>
                   )}
      
      <div className="container">
        <h3>Current Query Status:</h3>
        <p>
          https://api.apiflash.com/v1/urltoimage?access_key=ACCESS_KEY    
          <br></br>
             &url={inputs.url} <br></br>
          &format={inputs.format} <br></br>
              &width={inputs.width}
          <br></br>
              &height={inputs.height}
            <br></br>
          &no_cookie_banners={inputs.no_cookie_banners}
              <br></br>
          &no_ads={inputs.no_ads}
            <br></br>
        </p>  </div>
      
      <br></br>
      
      <div className="container">
                <Gallery images={prevImages} />
            </div>
      
      {quota.remaining !== null && (
         <div className="quota">
          <p>API Calls Remaining: {quota.remaining} / {quota.limit}</p>
        </div>
      )}
    </div>
           );
}

export default App;
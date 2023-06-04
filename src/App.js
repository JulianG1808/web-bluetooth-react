import React /* , { useState, useEffect } */ from 'react';
import './App.css';

function App() {
  
  const connectDevice = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        optionalServices: ["battery_service", "device_information"],
        acceptAllDevices: true,
      })
      
      //connect to the GATT server
      let deviceName = device.gatt.device.name;
      const server = await device.gatt.connect();

      //get the services we need through GATT server
      const batteryService = await server.getPrimaryService("battery_service")
      const infoService = await server.getPrimaryService("device_information")

    } catch (err) {
        console.log(err)
        alert("An error occured while fetching device details")
    }
  }


  return (
    <div>
      <button>Connect</button>
      <button>Disconnect</button>
    </div>
  )
}

export default App;

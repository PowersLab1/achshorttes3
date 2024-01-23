import React, { Component } from 'react';
import './VolumeCalibrationInstructions.css';
import { Redirect } from "react-router-dom";
import { playWhiteNoise } from '../lib/Stim.js'; 
import { setWhiteNoiseDb } from '../lib/Stim.js';


class VolumeCalibrationInstructions extends Component {

    constructor(props) {
        super(props);
        this.state = {
          continue: false,
          volumeLevel: 80, // Initial volume level
          decreaseCount: 0 // Counter for the number of times volume is decreased
        }
        this.audioContext = new AudioContext(); // Creating an AudioContext for playing the white noise
      }

      // playNoise = () => {
      //   console.log("Calling playWhiteNoise with volume:", this.state.volumeLevel);
      //   playWhiteNoise(this.audioContext, this.state.volumeLevel); // Play white noise with current volume level
      // }
      

      
      decreaseVolume = () => { 
        if (this.state.decreaseCount < 5) {
            this.setState(prevState => ({
                volumeLevel: prevState.volumeLevel - 15, // Decrease by 15 dB
                decreaseCount: prevState.decreaseCount + 1
            }), () => {
                setWhiteNoiseDb(this.state.volumeLevel); // Update the volume in Stim.js
                // Recreate the audio context to force update
                this.audioContext.close().then(() => {
                    this.audioContext = new AudioContext();
                    this.playNoise(); // Play the noise again with the updated volume
                });
            });
        }
    }
    

      keyFunction = (event) => {
        if(event.keyCode === 81) { // If 'Q' is pressed
          this.setState({ continue: true });
        } //else if (event.keyCode === 69) { // If 'E' is pressed
          //this.decreaseVolume();
        //}
      }

      componentDidMount(){
        document.addEventListener("keydown", this.keyFunction, false);
        //this.playNoise(); // Play white noise when component mounts
      }

      componentWillUnmount(){
        document.removeEventListener("keydown", this.keyFunction, false);
      }

      render() {
        if(this.state.continue === true){
          return <Redirect to="/VolumeCalibration1" /> // Redirect to the Instructions page before practice trial component when 'Q' is pressed
        }

        return (
          <div className="VolumeInstructions">
            <input type="hidden"/>
            <header className="VolumeInstructions-header">
            <div className="text-container">
              <p className="VolumeInstructions-text">
              REMEMBER: First we may need to adjust the background white noise volume.
              <br /><br /> Unless you are using a new computer/headaphones <b>please set the volume to the same as last time!</b>
              <br /><br /> You should <b>press "E"</b> the <b>same number of times as you did before</b>.
              <br /><br /> Once you decrease to the right level  <b>press "Q"</b> and the game will continue!
              <br /><br /> If you did not decrease the volume last time, just <b>press "Q" on the first screen</b> to begin!
              <br /><br /> <b> Press Q and you will hear the white noise and be ableto decrease it </b> 
              </p>
            </div>
            </header>
          </div>
        );
      }
    }

    export default VolumeCalibrationInstructions;

    //old decrease volume function w/o creating new audiocontext
// decreaseVolume = () => {
      //   if (this.state.decreaseCount < 5) {
      //     this.setState(prevState => ({
      //       volumeLevel: prevState.volumeLevel - 15, // Decrease by 15 dB
      //       decreaseCount: prevState.decreaseCount + 1
      //     }), () => {
      //       console.log("Decreased volume to:", this.state.volumeLevel);
      //       setWhiteNoiseDb(this.state.volumeLevel); // Update the volume in Stim.js this.state.volumeLevel is the argument newdB
      //       this.playNoise(); // Play the noise again with the updated volume
      //     });
      //   } else {
      //     console.log("Maximum decreases reached");
      //   }
      // }
      //this decrease volume creates a new AudioContext which could cause  performance issues!!!
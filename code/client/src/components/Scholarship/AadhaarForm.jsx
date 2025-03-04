  import React from 'react';
  import { useNavigate } from "react-router-dom";
  import axios from "axios";
  function RedStar() {
    return <span style={{ color: 'red' }}>*</span>;
  }


  const StudentAadhaarForm = (req,res) => {

    const navigate = useNavigate();

    const [aadharNo, setaadharNo] = React.useState("");
    const [userEnteredOTP,setUserEnteredOTP] = React.useState("");
    const [message,setMessage] = React.useState("");
    // const [registrationCompleted, setRegistrationCompleted] = React.useState(false);
    // const [applicationId, setApplicationId] = React.useState('');

    const handleUserEnteredOtpChange = (e) => {
      setUserEnteredOTP(e.target.value);
    }

    const handleInputChange = (e) => {
      setaadharNo(e.target.value);
    };

    const handleGetOtp = async () => {
      try {
        const response = await axios.post("http://localhost:4000/aadhaar/verify-aadhaar", {    //first verifies Aadhaar.
          aadharNo : aadharNo       
        });

        // const response = await axios.post("http://localhost:4000/aadhaar/verify-aadhaar", {aadharNo:aadharNo});

        if (response.data.success === true) {        //If Aadhaar is valid, send otp
              try {
                const response = await axios.post("http://localhost:4000/otp/aadhaar/send-otp", {aadharNo:aadharNo});

                const responseOTPMessage = response.data.message;
                alert(responseOTPMessage);
              } catch(error) {
                  console.error("Error sending OTP: ",error);
              }
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error("Error occurred while verifying Aadhaar/Virtual ID:", error);
        alert("Error occurred while verifying Aadhaar/Virtual ID. Please try again later.");
      }
    }

    const handleVerify=async()=>{

      try {
        const response = await axios.post('http://localhost:4000/otp/aadhaar/verify-otp', {
            aadharNo : aadharNo,
            userEnteredOTP : userEnteredOTP,
        });
        
        console.log(response.data);
        if (response.data.status === "success") {
          alert(response.data.message);
          setMessage(response.data.message);
          navigate('/applicant-registration', {state:{aadharNo: aadharNo}});
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error("Error verifying OTP: ", error);
      }
    }

    // const handleRegister = async() => {
    //   try {
    //     const newApplicationId = Math.random().toString(36).substr(2, 10).toUpperCase();
    //     setRegistrationCompleted(true);
    //     setApplicationId(newApplicationId);

    //     const formData = { input: input, appId : newApplicationId };
    //     const response = await axios.post(`http://localhost:4000/student/register-student`, formData);

    //     if (response.data.success == true) {
    //       setMessage(response.data.message);
    //       alert(response.data.message);
          
    //       navigate("/applicant-registration");
          
    //     } else {
    //       alert("Student registration failed!");
    //     }
    //     setTimeout(() => {
    //       navigate("/applicant-registration");
    //     }, 10000);

    //   } catch(error) {
    //     console.error("Error registering student:",error);
    //   }
    // }

  
    return (
      <div className="card-form shadow p-4 mt-4">
        <div className="row">
          <div className="col-sm-5 mb-3">
            <label className="form-label">Enter Aadhaar Number<RedStar /></label>
            <div className="input-group">
              <input type="numeric" placeholder="" required className="form-control" value={aadharNo} onChange={handleInputChange} />
              <button type="button" onClick={handleGetOtp} className="btn btn-sm btn-primary">Get OTP</button>
            </div>
          </div>
      </div>
        <div className="col-sm-2 mb-3">
          <label className="form-label">Enter OTP <RedStar /></label>
          <input type="text" maxLength="6" className="form-control" placeholder="" onChange={handleUserEnteredOtpChange} />
        </div>
        <div className="col-sm-3 mb-3">
          <label className="form-label d-block">&nbsp;</label>
          <button type="button" className="btn btn-md btn-primary" onClick={handleVerify}>Verify</button>
        </div>
        {/* {message && message.includes("succes") && (
          <div className='col-sm3 mb-3'>
            <button type='button' className='btn btn-md btn-primary' style={{backgroundColor: "green", border: "green"}} onClick={handleRegister}>Register with ISP</button>
          </div>
        )} */}
        {/* {message && message.includes("successfully") && (
          <div className="success-message" style={{ display: registrationCompleted ? 'block' : 'none' }}>
            <div className="registration-completed-box">
              <p><svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
              </svg></p>
              <p>Your Application ID: {applicationId}</p>
            </div>
          </div>
        )} */}
      </div>
    );
  } 

  export default StudentAadhaarForm;
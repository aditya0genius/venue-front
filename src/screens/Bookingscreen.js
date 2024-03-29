import React,{useState,useEffect} from 'react'
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from '../components/Loader';
import Error from '../components/Error';
import moment from 'moment';
import StripeCheckout from 'react-stripe-checkout';

function Bookingscreen({match}) {
    const [room, setroom] = useState();
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState();    
    const { roomid } = useParams();
    const { fromdate } = useParams();
    const { todate } = useParams();
    const fromdates = moment(fromdate , 'DD-MM-YYYY')
    const todates = moment(todate , 'DD-MM-YYYY')
    const totaldays = moment.duration(todates.diff(fromdates)).asDays()+1
    const [totalamount , settotalamount] = useState();

    useEffect(() => {
      async function fetchData() {
        if(!localStorage.getItem('currentuser')){
          window.location.reload = '/login';
        }
        try {
            setloading(true);
            const data = (await axios.post("/api/rooms/getroombyid" , {roomid})).data;
            settotalamount(data.rentperday * totaldays);
            setroom(data);
            setloading(false);
        } catch (error) {
            setloading(false);
            seterror(true);
        }
      }
      fetchData();
    }, []);
    
    
    async function onToken(token){
      console.log(token);
      const bookingDetail ={
        room,
        userid:JSON.parse(localStorage.getItem('currentuser'))._id,
        fromdate,
        todate,
        totalamount,
        totaldays,
        token
      };

      try {
        const result = await axios.post('/api/bookings/bookroom',bookingDetail );
        window.location.href = '/profile'
      } catch (error) {
        console.log(error);
      }
    }


  return (
    <div className='m-5' data-aos="flip-left">
      {loading ? (<h1><Loader/></h1>) : room ? (<div>
        <div className="row justify-content-center my-3 bs">
            <div className="col-md-6 my-2">
                <h1>{room.name}</h1>
                <img src={room.imageurls[0]} alt="something" className='bigimgs'/>
            </div>
            <div className="col-md-4 ">
              <div style={{textAlign : 'right'}}>
                <h1>Booking details</h1>
                <hr />
                <b>
                  <p>Name: {JSON.parse(localStorage.getItem('currentuser')).name}</p>
                  <p>From date: {fromdate}</p>
                  <p>To date: {todate}</p>
                  <p>Max count: {room.maxguest}</p>
                </b>
                </div>
                <div style={{textAlign : 'right'}}>
                  <h1>Amount</h1>
                  <hr />
                  <b>
                    <p>Total days: {totaldays} </p>
                    <p>Rent per day: {room.rentperday}</p>
                    <p>Total amount: {totalamount} </p>
                  </b>
                </div>
                <div style={{float : 'right'}}>
                <StripeCheckout
                  amount={totalamount * 100}
                  token={onToken}
                  currency='INR'
                  stripeKey="pk_test_51K7dyhSC6jJVpViAEdamZtVGulyLLQMsGpUC6BmWMczamHjwDAJ3bWRq6GJWWztJwzZM6mbE3Hc0VL69CW4ZxhKd00yrC8PlpG"
                  >
                    <button className='btn btn-primary'>
                      Pay now{" "}
                    </button>
                    </StripeCheckout>

                </div>
            </div>
        </div>
      </div>) : (<Error/>) }
    </div>
  )
}

export default Bookingscreen
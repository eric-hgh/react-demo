import React, { useState , useEffect} from "react";
import useDidUpdate from "../../utils/hooks/useDidUpdate"
import http from "@utils/http";
import request from "@utils/request";

import Meno from "./meno"


const Learn: React.FC = () => {
 
  const [ num , setNum ] = useState(0);
  const [ text , setText ] = useState('');

  request.request({ url: "https://api.chemm.com/portal/api/slides?type=home", method: "GET" }).then(res =>  console.log('request',res));
  http.request({ url: "https://api.chemm.com/portal/api/slides?type=home", method: "GET" }).then(res =>  console.log('http1',res));

  http.get( "https://api.chemm.com/portal/api/slides?type=home" ).then(( res ) => { 
    console.log('http2',res)
  }).catch(( err ) => {
    console.log('失敗',err.message)
  });
  
  useDidUpdate(() => {
    console.log('更新componentDinMount')
  },[ num])
  useEffect(() => {
      console.log('挂載componentDinMount')

      return () => {
          console.log('銷毀componentDinMount')
      }
  },[])

  return (
    <div>
      <div onClick={() => setNum(num+1)}>学习 {num}</div>
      <div onClick={() => setText('2122222')}>改变文字 {text}</div>
      <Meno  num={ num } ></Meno>

    </div>
    
  );
};

export default Learn;

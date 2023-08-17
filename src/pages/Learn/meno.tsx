import React, { useState, Suspense } from "react";




interface Props {
  num: number;
}

const Meno: React.FC<Props> = (props) => {
 
    console.log('meno刷新',props)
    return (
      <div>学习2</div>
    );
  
};

export default React.memo(Meno);


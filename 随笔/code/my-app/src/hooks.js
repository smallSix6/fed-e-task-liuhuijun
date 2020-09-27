import {useState,useEffect} from 'react'

export const useWindowSize = () => {
  const [width, setWidth] = useState('0px')
  const [height, setHeight] = useState('0px')
  useEffect(()=>{
    setWidth(document.documentElement.clientWidth+ 'px')
    setHeight(document.documentElement.clientHeight+ 'px')
  },[])
  useEffect(()=>{
    const handleResize = ()=>{
      setWidth(document.documentElement.clientWidth+ 'px')
      setHeight(document.documentElement.clientHeight+ 'px')
    }
    window.addEventListener('resize',handleResize,false)
    return ()=>{
      window.removeEventListener('resize',handleResize,false)
    }
  },[])
  return [width, height]
}


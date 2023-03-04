import * as mobilenet from "@tensorflow-models/mobilenet"
import axios from 'axios'
import { useEffect, useState, useRef } from 'react'
import { 
  RollbackOutlined, 
  LoadingOutlined, 
  StarTwoTone, 
  UpCircleFilled, 
  DownCircleFilled, 
  SearchOutlined, 
  LikeOutlined,
  SettingOutlined } from '@ant-design/icons';
import { 
  Avatar, 
  Card, 
  Button, 
  Input, 
  Tooltip, 
  Col, 
  Row, 
  Popover } from 'antd';
import { Switcher } from '../components/Switcher';
import earthBg from '../assets/galaxy2.mp4'
import { useNavigate } from 'react-router-dom';
import ImageModal from '../components/ImageModal';

const { Meta } = Card;
const Access_Key = import.meta.env.VITE_UNSPLASH_ACCESS_KEY

const HomePage = () => {
  const [allPhotos, setAllPhotos] = useState([])
  const [searchPhotosResults, setSearchPhotosResults] = useState([])
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [model, setModel] = useState(null)
  const [imageURL, setImageURL] = useState(null)
  const [predictedImg, setPredictedImg] = useState("")
  const [searchByImage, setSearchByImage] = useState(false)

  const navigate = useNavigate()

  const imageRef = useRef()

  const firstName = localStorage.getItem("firstName") !== "" ? localStorage.getItem("firstName") : "Anonymous" 

  const loadModel = async () => {
    setIsModelLoading(true)
    try {
      const model = await mobilenet.load()
      setModel(model)
      setIsModelLoading(false)
    } catch (error) {
      console.log(error)
      setIsModelLoading(false)
    }
  }

  

  const uploadImage = (e) => {
    const {files} = e.target
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0])
      setImageURL(url)
    } else {
      setImageURL(null)
    }
   }

  const identify = async () => {
    console.log(imageRef.current)
    const results = await model.classify(imageRef.current)
    const result = results[0]?.className
    const cleaned_result = result?.slice(0,result.indexOf(","))
    setPredictedImg(cleaned_result)
    setQuery(predictedImg)
  }

  const listPhotos = async() => {
    try {
        setIsLoading(true)
        const res = await axios.get(`https://api.unsplash.com/photos?client_id=${Access_Key}`)
        setAllPhotos(res.data)
    } catch(e){
        console.log(e)
    }
    setIsLoading(false)
  }

  const searchPhotos = async () => {
    try {
      setIsLoading(true)
      const res = await axios.get(`https://api.unsplash.com/search/photos?query=${query}&client_id=${Access_Key}`)
      setSearchPhotosResults(res.data.results)
    } catch(e) {
      console.log(e);
    }
    setIsLoading(false)
  }

  useEffect(() => {
    searchPhotos()
  }, [query])

  useEffect(() => {
    listPhotos()
    loadModel()
  }, [])

  return (
    <div>
      {/* <Navbar /> */}
      {/* Navbar */}
      <div className='flex justify-between items-center px-10 py-5 bg-gray-100 dark:bg-[#232323]'>
        {/* Logo */}
        <div className='flex px-10'>
          <h1 className='dark:text-white text-3xl font-bold'>Image Gallery</h1>
        </div>
        {/* Search bar */}
        <div className='flex gap-3 items-center'>
          <Input 
            placeholder="Search any image..." 
            onChange={(e) => setQuery(e.target.value)}
            prefix={<SearchOutlined />}
            size="large"
            allowClear
            className='rounded-2xl' 
          />
          {!searchByImage ? 
            <Tooltip placement="bottom" title="Open search by image section">
              <DownCircleFilled className='text-black dark:text-white text-3xl mb-2' onClick={() => setSearchByImage(true)} />
            </Tooltip>
            :
            <Tooltip placement="bottom" title="Close search by image section">
              <UpCircleFilled className='text-black dark:text-white text-3xl mb-2' onClick={() => setSearchByImage(false)}/>
            </Tooltip>
          }
          <div className='lg:hidden'>
            <Popover 
              placement='bottom'
              title="Settings"
              content={
                <div className='flex flex-col'>
                  <div className='flex gap-1 mt-1 place-content-center'>
                    <Tooltip placement="bottom" title="Light Mode">
                      <img src="https://cdn-icons-png.flaticon.com/512/169/169367.png" alt="" width="25px"/>
                    </Tooltip>
                    <Switcher />
                    <Tooltip placement="bottom" title="Dark Mode">
                      <img src="https://cdn-icons-png.flaticon.com/512/180/180700.png" alt="" width="23px"/>
                    </Tooltip>
                  </div>
                  <div className='py-5'>
                    <Tooltip placement="bottom" title="Go back to welcome page">
                      <Button onClick={() => navigate("/")}>Back to Welcome Page</Button>
                    </Tooltip>
                  </div>
                </div>
              }
            >
              <SettingOutlined className='text-black dark:text-white text-3xl mb-2'/>
            </Popover>
          </div>
        </div>
        {/* links */}
        <div className='hidden lg:flex lg:gap-8'>
          <div className='flex gap-1'>
            <StarTwoTone className='text-xl'/>
            <p className='mt-1 dark:text-white'>Hi <b>{firstName}</b>!</p>
          </div>
          <div>
            <Tooltip placement="bottom" title="Go back to welcome page">
              <RollbackOutlined className='dark:text-white' onClick={() => navigate("/")}/>
            </Tooltip>
          </div>
          <div className='flex gap-1 mt-1'>
            <Tooltip placement="bottom" title="Light Mode">
              <img src="https://cdn-icons-png.flaticon.com/512/169/169367.png" alt="" width="25px"/>
            </Tooltip>
            <Switcher />
            <Tooltip placement="bottom" title="Dark Mode">
              <img src="https://cdn-icons-png.flaticon.com/512/180/180700.png" alt="" width="23px"/>
            </Tooltip>
          </div>
        </div>
      </div>
      {searchByImage && 
      <div className='bg-gray-100 dark:bg-[#232323]'>
        <div className='flex justify-center pb-2'>
          <h1 className='dark:text-white text-5xl'>Search by Image</h1>
        </div>
        <div className='flex justify-center py-2'>
          <input 
              type="file" 
              accept="image/*" 
              capture='camera' 
              className="dark:text-white" 
              onChange={uploadImage}
          />
        </div>
        
        <div className='flex justify-center'>
            {imageURL && 
            <div>
              <label className='dark:text-white'>Image Preview</label>
              <img width="500px" src={imageURL} alt="" crossOrigin="anonymous" ref={imageRef} />
            </div>
            }
        </div>
        <div className='flex justify-center pb-10 pt-5'>
          {imageURL && 
          <div className='flex gap-5'>
            <Button 
              onClick={identify}
              className="dark:text-white"
            >
              Search
            </Button>
            <Button 
              onClick={() => {
                  setQuery("")
                  setImageURL(null)
                  imageRef.current = ""
              }}
              className="dark:text-white"
            >
              Clear
            </Button>
          </div>}
        </div>
      </div>}
      <div className='relative flex items-center justify-center h-96 overflow-hidden'>
        <div className='relative z-30 p-5 text-6xl text-white bg-opacity-50 rounded-xl'>
          <div className='text-lg lg:hidden'>
            Hi {firstName}!
          </div>
          SEARCH AMAZING IMAGES
        </div>
        <video
          autoPlay
          loop
          muted
          className='absolute z-10 w-auto min-w-full min-h-full max-w-none'
          >
            <source 
                src={earthBg}
                type="video/mp4"
            />
            Your browser does not support the video tag
          </video>
      </div>
      {isLoading && 
        <div className='grid place-items-center bg-gray-100 dark:bg-[#232323]'>
          <LoadingOutlined className='dark:text-white text-6xl'/>
        </div>}
      <div className="bg-gray-100 dark:bg-[#232323]">
      {query === "" ?
        <Row className='flex flex-wrap justify-center'>
            {allPhotos && allPhotos.map((photo) => {
              return(
                <Col className='p-4 max-w-sm' key={photo.id}>
                  <Card
                    key={photo.id}
                    style={{ width: 320 }}
                    cover={
                      <img 
                        alt=''
                        src={photo.urls.thumb}
                      />
                    }
                    className='dark:bg-[#141414]'       
                  >
                    <Meta 
                      avatar={<Avatar size="large" src={photo.user.profile_image.small} />}
                      title={
                        <div className='flex justify-between'>
                          <p className='text-black dark:text-white'>{photo.user.first_name ? photo.user.first_name : ""} {photo.user.last_name ? photo.user.last_name : ""}</p>
                          <div className='flex gap-1'>
                            <LikeOutlined className='mt-1 text-black dark:text-white'/>
                            <p className='text-black dark:text-white'><b>{photo.likes}</b></p>
                          </div>
                        </div>}
                      description={
                        <div className='flex justify-between'>
                          <p className='text-black dark:text-white'>{photo.user.instagram_username ? '@' + photo.user.instagram_username : ''}</p>
                          <div>
                            <ImageModal id={photo.id}/>
                          </div>
                        </div>}
                      className="bg-white dark:bg-[#141414]" 
                    />
                  </Card>
                </Col>
              )
            })}
        </Row>
        :
        <Row className='flex flex-wrap justify-center'>
          {searchPhotosResults && searchPhotosResults.map((photo) => {
            return(
              <Col className='p-4 max-w-sm' span={6} key={photo.id}>
                <Card
                  key={photo.id}
                  style={{ width: 300 }}
                  cover={
                    <img 
                      alt=''
                      src={photo.urls.thumb}
                    />
                  }   
                  className='dark:bg-[#141414]'              
                >
                  <Meta 
                    avatar={<Avatar size="large" src={photo.user.profile_image.small} />}
                    title={
                      <div className='flex justify-between'>
                        <p className='text-black dark:text-white'>{photo.user.first_name ? photo.user.first_name : ""} {photo.user.last_name ? photo.user.last_name : ""}</p>
                        <div className='flex gap-1'>
                          <LikeOutlined className='mt-1 text-black dark:text-white'/>
                          <p className='text-black dark:text-white'><b>{photo.likes}</b></p>
                        </div>
                      </div>}
                    description={<p className='text-black dark:text-white'>{photo.user.instagram_username ? '@' + photo.user.instagram_username : ''}</p>}
                    className="bg-white dark:bg-[#141414]" 
                  />
                </Card>
              </Col>
            )
          })}
        </Row>
        }
      </div>
    </div>
  )
}

export default HomePage
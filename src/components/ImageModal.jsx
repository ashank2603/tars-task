import { useState } from 'react';
import { 
    InstagramOutlined, 
    TwitterOutlined, 
    EyeTwoTone, 
    EyeFilled, 
    RightSquareFilled , 
    LikeOutlined, 
    QrcodeOutlined, 
    DownloadOutlined }  from '@ant-design/icons';
import { Modal, Tooltip, Popover, Tag, Image, QRCode, Avatar } from 'antd';
import axios from 'axios';

const ImageModal = ({ id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoDetails, setPhotoDetails] = useState({});

  const Access_Key = import.meta.env.VITE_UNSPLASH_ACCESS_KEY

  const content = (
    <div className='flex flex-col'>
        <div className='flex gap-5 place-content-center'>
            <Avatar size={64} src={photoDetails.user?.profile_image.large}/>
            <div className='py-5'>
                <h1 className='text-lg font-bold'>{photoDetails.user?.name}</h1>
            </div>
        </div>
        <div className='flex flex-col items-center'>
            <div className='flex gap-1'><b>Total Number of Collections:</b>{photoDetails.user?.total_collections}</div>
            <div className='flex gap-1'><b>Total Number of Photos:</b>{photoDetails.user?.total_photos}</div>
            <div className='flex gap-1'><b>Total Number of Likes:</b>{photoDetails.user?.total_likes}</div>
        </div>
        <div className="flex mt-5 place-content-center gap-5 mb-5">
            {photoDetails.user?.social.instagram_username &&
            <div className='bg-white rounded-2xl items-center py-2 px-3'>
                <Tooltip placement="bottom" title={`Instagram: ${photoDetails.user?.social.instagram_username}`}>
                    <InstagramOutlined onClick={() => window.open(`https://www.instagram.com/${photoDetails.user?.social.instagram_username}`, "_blank")} className='text-xl pb-1.5'/>
                </Tooltip>
            </div>}
            {photoDetails.user?.social.twitter_username && 
            <div className='bg-white rounded-2xl items-center py-2 px-3'>
                <Tooltip placement="bottom" title={`Twitter: ${photoDetails.user?.social.twitter_username}`}>
                    <TwitterOutlined onClick={() => window.open(`https://twitter.com/${photoDetails.user?.social.twitter_username}`, "_blank")} className='text-xl pb-1.5'/>
                </Tooltip>
            </div>}
        </div>
    </div>
  )

  const showModal = () => {
    setIsModalOpen(true);
    listPhoto()
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const listPhoto = async() => {
    try {
        // setIsLoading(true)
        const res = await axios.get(`https://api.unsplash.com/photos/${id}?client_id=${Access_Key}`)
        setPhotoDetails(res.data)
        // console.log(photoDetails);
    } catch(e){
        console.log(e)
    }
    // setIsLoading(false)
  }

  return (
    <div>
      <Tooltip placement="bottom" title="View Post Details">
        <EyeTwoTone onClick={showModal} className="text-2xl"/>
      </Tooltip>
      <Modal 
        title={photoDetails.description} 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={handleCancel} 
        closable={false}
        footer={null}
      >
        <div className="relative mx-4 mt-4 overflow-hidden rounded-xl bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40">
            <Image src={photoDetails?.urls?.full} />
        </div>
        <div className='p-6'>
            <div className='mb-3 flex items-center justify-between'>
                <h5 className="block text-white font-sans text-xl font-medium leading-snug tracking-normal text-blue-gray-900 antialiased">
                    {photoDetails.alt_description ? photoDetails.alt_description : `Photo by ${photoDetails.user?.name}`}
                </h5>
            </div>
            <p className="block font-sans text-base font-light leading-relaxed text-gray-700 antialiased">
                <p className='text-white font-bold'>Related Tags:</p>
                {photoDetails.tags && photoDetails.tags.map((tag) => {
                    return(
                        <Tag color="geekblue">{tag.title}</Tag>
                    )
                })}
            </p>
            <div className="flex mt-5 place-content-center gap-5 mb-5">
                <div className='bg-white rounded-2xl items-center py-2 px-3'>
                    <Tooltip placement="bottom" title={`Total Downloads: ${photoDetails.downloads}`}>
                        <DownloadOutlined className='text-xl pb-1.5'/>
                    </Tooltip>
                </div>
                <div className='bg-white rounded-2xl items-center py-2 px-3'>
                   <Tooltip placement="bottom" title={`Total Views: ${photoDetails.views}`}>
                        <EyeFilled className='text-xl pb-1.5'/>
                    </Tooltip>
                </div>
                <div className='bg-white rounded-2xl items-center py-2 px-3'>
                   <Tooltip placement="bottom" title={`Total Likes: ${photoDetails.likes}`}>
                        <LikeOutlined className='text-xl pb-1.5'/>
                    </Tooltip>
                </div>
                <div className='bg-white rounded-2xl items-center py-2 px-3'>
                   <Tooltip placement="bottom" title='Generate QR'>
                        <Popover 
                            placement='top' 
                            title="Share via QR" 
                            content={
                                <div>
                                    <QRCode value={photoDetails.urls?.full} /> 
                                </div>
                            }
                        >
                            <QrcodeOutlined className='text-xl pb-1.5'/>
                        </Popover>
                    </Tooltip>
                </div>
                <div className='bg-white rounded-2xl items-center py-2 px-3'>
                   <Tooltip placement="bottom" title="View User Profile">
                        <Popover placement='right' title="User Info" content={content} trigger="click">
                            <RightSquareFilled className='text-xl pb-1.5'/>
                        </Popover>
                    </Tooltip>
                </div>
            </div>
            <div className="p-6 pt-3">
                <button
                className="block w-full select-none rounded-lg bg-pink-500 py-3.5 px-7 text-center align-middle font-sans text-sm font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                onClick={() => {
                    window.open(photoDetails.links.download, "_blank")
                }}
                >
                    Download
                </button>
            </div>
        </div>
      </Modal>
    </div>
  );
};
export default ImageModal;
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "./Home.css";
import { Logo } from '../images/Netflix'
import { ConnectButton, Tab, TabList, Button,Icon, Modal, useNotification} from 'web3uikit';
import { movies } from '../helpers/library';
import { useMoralis } from "react-moralis";

const Home = () => {
  const [visible, setVisible] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState();
  const { isAuthenticated, Moralis, account } = useMoralis();
  const [myMovies, setMyMovies] = useState();

  const dispatch = useNotification();
  const handleNewNotification = () => {
    dispatch({
      type: "error",
      message: "您尚未连接加密钱包，请点击右上角连接钱包后进行操作",
      title: "未进行加密验证！",
      position: "topL",
    });
  };

  const handleAddNotification = () => {
    dispatch({
      type: "success",
      message: "Movie Added to List",
      title: "Success",
      position: "topL",
    });
  };

  return(
    <>
    <div className="logo">
      <Logo/>
    </div>
    <div className='connect'>
      <Icon fill="#ffffff" size={24} svg="bell" />  
      <ConnectButton />
    </div>
    <div className="topBanner">
      <TabList defaultActiveKey={1} tabStyle="bar">
          <Tab tabKey={1} tabName={"Movies"}>
            <div className="scene">
              <img src = {movies[0].Scene} className = "sceneImg"></img>
              <img src={movies[0].Logo} className="sceneLogo" ></img>
              <p className="sceneDesc">{movies[0].Description}</p>
                <div className="playButton">
                <Button 
                  onClick={function noRefCheck(){}}
                  icon="chevronRightX2"
                  text="播放"
                  theme="primary"
                  type="button"
                />
                <Button 
                  onClick={function noRefCheck(){}}
                  icon="plus"
                  text="添加到我的列表"
                  theme="translucent"
                  type="button"
                />                
              </div>              
            </div>

          <div className="title">
            热门影片
          </div>
          <div className="thumbs">
          {   movies &&
              movies.map((e) => {
                return (
                  <img
                    src={e.Thumnbnail}
                    className="thumbnail"
                    onClick={() => {
                      setSelectedFilm(e);
                      setVisible(true);
                    }}
                  ></img>
                );
              })}
          </div>
          </Tab>
          <Tab tabKey={2} tabName={"Series"} isDisabled={true}></Tab>
          <Tab tabKey={3} tabName={"Mylist"}></Tab>
      </TabList>
      {selectedFilm && (
        <div className="modal">
            <Modal
              onCloseButtonPressed={() => setVisible(false)}
              isVisible={visible}
              hasFooter={false}
              width="1000px"
            >
              <div className="modalContent">
                <img src={selectedFilm.Scene} className="modalImg"></img>
                <img className="modalLogo" src={selectedFilm.Logo}></img>
                <div className="modalPlayButton">
                  {isAuthenticated ? (
                    <>
                      <Link to="/player" state={selectedFilm.Movie}>
                        <Button
                          icon="chevronRightX2"
                          text="播放"
                          theme="secondary"
                          type="button"
                          onClick={()=>console.log(isAuthenticated)}
                        />
                      </Link>
                      <Button
                        icon="plus"
                        text="添加到我的列表"
                        theme="translucent"
                        type="button"
                        onClick={async () => {
                          await Moralis.Cloud.run("updateMyList", {
                            addrs: account,
                            newFav: selectedFilm.Name,
                          });
                          handleAddNotification();
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <Button
                        icon="chevronRightX2"
                        text="播放"
                        theme="secondary"
                        type="button"
                        onClick={handleNewNotification}
                      />
                      <Button
                        icon="plus"
                        text="添加到我的列表"
                        theme="translucent"
                        type="button"
                        onClick={handleNewNotification}
                      />
                    </>
                  )}
                </div>
                <div className="movieInfo">
                  <div className="description">
                    <div className="details">
                      <span>{selectedFilm.Year}</span>
                      <span>{selectedFilm.Duration}</span>
                    </div>
                    {selectedFilm.Description}
                  </div>
                  <div className="detailedInfo">
                    类型:
                    <span className="deets">{selectedFilm.Genre}</span>
                    <br />
                    演员:
                    <span className="deets">{selectedFilm.Actors}</span>
                  </div>
                </div>
              </div>
            </Modal>
        </div>
      )}
    </div>
    </>
  )
}

export default Home;

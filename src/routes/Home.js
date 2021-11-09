import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { dbService } from "fbase";
import React, { useEffect } from "react";
import { useState } from "react/cjs/react.development";

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);

  // const getNweets = async () => {
  // document의 id와 함께 내가 이전에 만들었던 트윗들도 모두 가져와서 setNweets에 넣어주고 보일 수 있게 해줌
  //   const dbNweets = await dbService.collection("nweets").get();
  //   dbNweets.forEach((document) => {
  //     const nweetObject = {
  //       ...document.data(),
  //       id: document.id,
  //     };
  //     // set이 붙는 함수를 쓸때 값이 아니라 함수를 전달하게 되면 리액트는 이전 값에
  //     // 접근할 수 있게 해줌 => ...prev
  //     setNweets((prev) => [nweetObject, ...prev]);
  //   });
  // };

  useEffect(() => {
    // getNweets();
    // snapshot을 사용하면 실시간으로 추가되는 트윗을 볼 수 있음
    // 우리가 무언가 지우거나 업데이트하든 뭘 하든 실행됨
    dbService.collection("nweets").onSnapshot((snapshot) => {
      // 여기서 nweets는 우리 db collection의 이름
      // 상기의 getNweets를 구현하는 새로운 방식
      // 이 방식을 사용하면 더 적에 re-render하기 때문에 더 빨리 실행되도록 만들어줌
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray);
    });
  }, []);

  return (
    <div className="container">
      <NweetFactory userObj={userObj} />
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;

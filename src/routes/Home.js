import Nweet from "components/Nweet";
import { dbService, storageService } from "fbase";
import React, { useEffect } from "react";
import { useState } from "react/cjs/react.development";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  // nweet과 setNweet은 form을 위한 state.
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState("");

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

  const onSubmit = async (e) => {
    e.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      // collection과 비슷한 작동을 하는데 storage의 ref의 child에 uuid를 부여함
      const attachmenRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmenRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await dbService.collection("nweets").add(nweetObj);
    setNweet("");
    setAttachment("");
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };
  const onFileChange = (event) => {
    // input으로 이미지를 받아서 읽어오기위한 함수 생성
    const {
      target: { files },
    } = event;
    // event안에서 target안으로 가서 file을 받아오는것 = es6
    const theFile = files[0];
    // file[0]은 받아온 모든 파일 중 첫번째 파일만 받도록 하기 위해 작성
    // 받아온 파일을 읽어내기 위해 API사용하고 dataUrl로 읽어오는 것(참고자료는 mdn에 있음)
    // 즉, 받아온 파일을 url의 형태로 만들어 주는 것
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      // console.log(finishedEvent);
      const {
        currentTarget: { result },
      } = finishedEvent;
      // onloadend에 finishedEvent의 result를 setAttachment로 설정해주는 것
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => {
    setAttachment(null);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" alt="profile" />
            <button type="" onClick={onClearAttachment}>
              Clear
            </button>
          </div>
        )}
      </form>
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

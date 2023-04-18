import Layout from "@/components/Layout";
import { getData } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}

export default function Profile() {
  const [userData, setUserData] = useState("");
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [bioChanged, setBioChanged] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data } = await getData(); //otenção dos dados do utilizador atraves da função getData
                                        // e caso não esteja atenticado redireciona o utilizador para o index
      if (data.loggedIn == false) {
        router.push("/");
      } else {
        setUserData(data);
      }
    }
    fetchData().catch((error) => {
      router.push("/");
    });
  }, []);

  function handleBioChange() {
    setBioChanged(true);
    setButtonsVisible(true);
  }

  function handleCancelBioChange() {
    setButtonsVisible(false);
    window.location.reload();
  }

  async function handleSaveBioChange(event) {
    event.preventDefault();
    try {
      const response = await fetch("https://hubo.pt:3001/update_bio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ bio_user: bio }),
      });

      if (!response.ok) {
        throw new Error("Failed to update bio");
      }

      const data = await response.json();
      setBioChanged(false); 
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!userData?.user?.bio_user) {
      setBio("");
    } else {
      setBio(userData.user.bio_user);
    }
  }, [userData]);

  return (
    <div>
      <Layout>
        <div className="profile">
        <img src="static/profile_pic.png" alt="Profile Picture" className="profile_pic"/>
        <button onClick={logout} className="profile_logout">Logout</button>
        <p>
          <label>
            <span className="profile_labels">Username:</span><br />
            <input
              type="text"
              id="username"
              value={userData?.user?.username || ""}
              readOnly
            />
          </label>
        </p>
        <p>
          <label htmlFor="email">
            <span className="profile_labels">Email:</span><br />
            <input type="email" id="email" name="email" value={userData?.user?.email_user || ""} />
          </label>
        </p>
          <p>
            <label htmlFor="bio">
              <span className="profile_labels">Bio:</span><br/>
            {bioChanged ? (
              <span>
                <input
                  type="text"
                  id="bio"
                  value={bio}
                  onClick={() => setBioChanged(true)}
                  onChange={(e) => setBio(e.target.value)}
                />
                <br/>
                {buttonsVisible && (
                  <div className="buttons_savebio">
                    <button  onClick={handleSaveBioChange} className="button_save">Save</button>
                    <button onClick={handleCancelBioChange} className="button_cancel">Cancel</button>
                  </div>
                )}
              </span>
            ) : (
    
                <input
                  type="text"
                  id="bio"
                  value={bio}
                  onClick={handleBioChange}
                  readOnly
                />
            )}
          </label>
          </p>
        </div>
      </Layout>
    </div>
  );
}

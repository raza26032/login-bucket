const url = "http://localhost:5000";
// var url = "https://twitter-jahan.herokuapp.com"

var socket = io(url);
socket.on('connect', function () {
    console.log("connected")
});

function signup() {
    axios({
        method: 'post',
        url: url + '/signup',
        data: {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value.toLowerCase(),
            password: document.getElementById('password').value,
            phone: document.getElementById('phone').value,
            gender: document.getElementById('gender').value,
        },
        withCredentials: true
    }).then((response) => {
        if (response.data.status === 200) {
            alert(response.data.message)
            location.href = "../login.html"
        } else {
            alert(response.data.message);
        }
    }).catch((error) => {
        console.log(error);
    });
    return false
}

function login() {
    axios({
        method: 'post',
        url: url + '/login',
        data: {
            email: document.getElementById('email').value.toLowerCase(),
            password: document.getElementById('password').value,
        },
        withCredentials: true
    }).then((response) => {
        if (response.data.status === 200) {
            alert(response.data.message)
            location.href = "./profile.html"
        }
        else {
            alert(response.data.message)
        }
    }, (error) => {
        console.log(error);
    });
    return false
}

function forgetPassword() {
    let email = document.getElementById('femail').value;
    localStorage.setItem('email', email)
    axios({
        method: 'post',
        url: url + '/forget-password',
        data: {
            email: email,
        },
        withCredentials: true
    }).then((response) => {
        if (response.data.status === 200) {
            alert(response.data.message)
            location.href = "../forget2.html"
        }
        else {
            alert(response.data.message)
        }
    }, (error) => {
        console.log(error);
    });
    return false
}

function forgetPassword2() {
    let getEmail = localStorage.getItem('email')
    axios({
        method: 'post',
        url: url + '/forget-password-2',
        data: {
            email: getEmail,
            newPassword: document.getElementById('newPassword').value,
            otp: document.getElementById('otp').value,
        },
        withCredentials: true
    }).then((response) => {
        if (response.data.status === 200) {
            alert(response.data.message)
            location.href = "../login.html"
        }
        else {
            alert(response.data.message)
        }
    }, (error) => {
        console.log(error);
    });
    return false
}

// function logout() {
//     axios({
//         method: 'post',
//         url: url + '/logout',
//     }).then((response) => {
//         location.href = "../login.html"
//     }, (error) => {
//         console.log(error);
//     });
//     return false
// }

function getProfile() {
    axios({
        method: 'get',
        url: url + "/profile",
    }).then((response) => {
        document.getElementById('welcomeUser').innerHTML = response.data.profile.name;
        sessionStorage.setItem("email", response.data.profile.email);
        if (response.data.profile.profileUrl) {
            document.getElementById("fileInput").style.display = "none";
            document.getElementById("uploadBtn").style.display = "none";
            document.getElementById("profilePic").src = response.data.profile.profileUrl;
        }
        else{
            document.getElementById("uploadTxt").innerHTML = "Upload profile picture";
        }
        getTweets();
    }, (error) => {
        location.href = "./login.html"
    });

}

const getTweets = () => {
    document.getElementById("posts").innerHTML = "";
    const Http = new XMLHttpRequest();
    Http.open("GET", url + "/getTweets");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4) {

            data = JSON.parse((Http.responseText));
            for (let i = 0; i < data.tweets.length; i++) {
                date = moment((data.tweets[i].createdOn)).fromNow()
                var eachTweet = document.createElement("li");
           if (data.tweets[i].profileUrl)
           {
            eachTweet.innerHTML =
            `            
            <img src="${data.tweets[i].profileUrl}" alt="Avatar" class="avatar">  
            <h4 class="userName">
            ${data.tweets[i].userName}
        </h4> 
        <small class="timeago">${date}</small>
    
        <p class="userPost" datetime=${date}>
            ${data.tweets[i].tweetText}
        </p>`
           }
           else{
            eachTweet.innerHTML =
            `            
            <img src="./image/image.png" alt="Avatar" class="avatar">  
            <h4 class="userName">
            ${data.tweets[i].userName}
        </h4> 
        <small class="timeago">${date}</small>
    
        <p class="userPost" datetime=${date}>
            ${data.tweets[i].tweetText}
        </p>`
           
           }
                document.getElementById("posts").appendChild(eachTweet)
            }
        }
    }
}

const postTweet = () => {

    email = sessionStorage.getItem("email");
    const Http = new XMLHttpRequest();
    Http.open("POST", url + "/postTweet")
    Http.setRequestHeader("Content-Type", "application/json");
    Http.send(JSON.stringify({
        email: email,
        tweetText: document.getElementById("tweetText").value,
    }))
    document.getElementById("tweetText").value = "";
}

const myTweets = () => {
    document.getElementById("posts").innerHTML = "";
    const Http = new XMLHttpRequest();
    Http.open("GET", url + "/myTweets");
    Http.send();
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4) {
            let jsonRes = JSON.parse(Http.responseText)
            for (let i = 0; i < jsonRes.tweets.length; i++) {
                date = moment(jsonRes.tweets[i].createdOn).fromNow()
                var eachTweet = document.createElement("li");
                if (data.tweets[i].profileUrl)
                {
                eachTweet.innerHTML =
                    `
                <img src="${data.tweets[i].profileUrl}" alt="Avatar" class="avatar">  
                    <h4 class="userName">
                    ${jsonRes.tweets[i].userName}
                </h4> 
                <small class="timeago">${date}</small>
                <p class="userPost">
                    ${jsonRes.tweets[i].tweetText}
                </p>`;
                document.getElementById("posts").appendChild(eachTweet)
            }
            else{
                eachTweet.innerHTML =
                    `
                <img src="./image/image.png" alt="Avatar" class="avatar">  
                    <h4 class="userName">
                    ${jsonRes.tweets[i].userName}
                </h4> 
                <small class="timeago">${date}</small>
                <p class="userPost">
                    ${jsonRes.tweets[i].tweetText}
                </p>`;
                document.getElementById("posts").appendChild(eachTweet)

            }
        }
        }
    }
}

socket.on("NEW_POST", (newPost) => {
    var eachTweet = document.createElement("li");
    
    
        eachTweet.innerHTML =
        `
        <h4 class="userName">
        ${newPost.name}
    </h4> 
    <p class="userPost">
        ${newPost.tweetText}
    </p>`;
    document.getElementById("posts").appendChild(eachTweet)
    
})

let logout = () => {
    axios({
        method: "post",
        url: url + "/logout",
    }).then((response) => {
        alert(response.data);
        sessionStorage.removeItem("email");
        window.location.href = "./login.html";
    })
}

function upload() {

    var fileInput = document.getElementById("fileInput");

    let formData = new FormData();

    formData.append("myFile", fileInput.files[0]);
    formData.append("myName", "malik");
    formData.append("myDetails",
        JSON.stringify({
            "email": sessionStorage.getItem("email"),
            "year": "2021"
        })
    );

    axios({
        method: 'post',
        url: url + "/upload",
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
    })
        .then(res => {
            document.getElementById("uploadTxt").innerHTML = ""
            location.reload();

        })
        .catch(err => {
            console.log(err);
        })

    return false;
}


function previewFile() {
    const preview = document.querySelector('img');
    const file = document.querySelector('input[id=fileInput]').files[0];
    const reader = new FileReader();

    reader.addEventListener("load", function () {
        preview.src = reader.result;
    }, false);

    if (file) {
        reader.readAsDataURL(file);
        document.getElementById("uploadBtn").style.display = "initial";
        document.getElementById("uploadTxt").innerHTML = "Press upload to upload profile picture";
    }
}
document.getElementById("uploadPicture").style.display="none";

function changeText(){
    document.getElementById("uploadPicture").style.display="block";
}
function hideText(){
    document.getElementById("uploadPicture").style.display="none";
}
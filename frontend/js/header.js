requireLogin();

const user = getUser();

document.addEventListener("DOMContentLoaded", () => {

    const topbar =
        document.querySelector(".topbar");

    if (!topbar || !user) return;

    const userBox = document.createElement("div");

    userBox.style.display = "flex";
    userBox.style.alignItems = "center";
    userBox.style.gap = "15px";

    userBox.innerHTML = `

<div
style="
display:flex;
flex-direction:column;
align-items:flex-end;
">

<span
style="
font-size:18px;
font-weight:bold;
">

<i class="fa-solid fa-user"></i>

${user.name}

</span>

<span
style="
font-size:14px;
color:gray;
">

${user.role}

</span>

</div>

<button
class="btn btn-danger"
onclick="logout()">

Logout

</button>

`;

    topbar.appendChild(userBox);

});
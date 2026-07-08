async function changePassword() {

    const user = getUser();

    if (!user) {

        location.href = "index.html";

        return;

    }

    const oldPassword =
        document.getElementById("oldPassword").value.trim();

    const newPassword =
        document.getElementById("newPassword").value.trim();

    const confirmPassword =
        document.getElementById("confirmPassword").value.trim();

    if (
        !oldPassword ||
        !newPassword ||
        !confirmPassword
    ) {

        alert("Fill all fields");

        return;

    }

    if (newPassword !== confirmPassword) {

        alert("Passwords do not match");

        return;

    }

    try {

        const response =
            await apiPut(
                "changePassword",
                {

                    email: user.email,

                    oldPassword,

                    newPassword

                }
            );

        alert(response.message);

        saveUser({

            ...user,

            mustChangePassword:false

        });

        location.href = "dashboard.html";

    }

    catch(error){

    console.error(error);

    alert(error.message);

}

}
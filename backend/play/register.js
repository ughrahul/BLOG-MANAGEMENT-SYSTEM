// register.js

const sendData = async (event) => {
  event.preventDefault(); // Prevent the default form submission behavior

  try {
    const form = document.getElementById("register");
    const formData = new FormData(form);

    // Send this data to the API
    const response = await axios.post(
      "http://localhost:8000/api/v1/users/register",
      formData
    );

    if (response.status >= 200 && response.status < 300) {
      // Display a success message
      const successMsg = document.getElementById("successMsg");
      successMsg.style.display = "block"; // Show the success message
    }
  } catch (error) {
    console.error(error);
  }
};

// Call the sendData function when the form is submitted
document.getElementById("register").addEventListener("submit", sendData);

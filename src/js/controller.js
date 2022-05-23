const formParas = document.querySelector(".form--paras");
const formTests = document.querySelector(".form--tests");

const sliders = document.querySelectorAll(".slider input");
const photo = document.querySelector(".input--photo");
const binaryImageSpace = document.querySelector(".binary-image-space");
const detectedImageSpace = document.querySelector(".detected-image-space");
const binaryImage = document.querySelector(".binary-image");
const detectedImage = document.querySelector(".detected-image");

if (formParas) {
  formParas.addEventListener("submit", function (e) {
    e.preventDefault();

    const FR = new FileReader();
    FR.readAsDataURL(photo.files[0]);

    FR.addEventListener("load", async function (e) {
      const res = await fetch("http://127.0.0.1:5000/test_parameters", {
        method: "POST",
        body: JSON.stringify({
          image: this.result,
          bin_grad: sliders[0].value,
          min_ele_area: sliders[1].value,
        }),
      });
      const data = await res.json();
      
      binaryImageSpace.classList.remove("hidden");
      detectedImageSpace.classList.remove("hidden");
      binaryImage.src = data.binary_img;
      detectedImage.src = data.detected_img;

      // const img = document.createElement("img");
      // img.src = this.result;
      // document.body.append(img);
    });
  });
}

if (sliders) {
  sliders.forEach((slider) => {
    slider.addEventListener("input", function (e) {
      const label = this.nextElementSibling;
      label.innerHTML = this.value;
    });
  });
}

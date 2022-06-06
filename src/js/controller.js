const formParas = document.querySelector(".form--paras");
const formTests = document.querySelector(".form--tests");

const sliders = document.querySelectorAll(".slider input");
const photo = document.querySelector(".input--photo");
const binaryImageSpace = document.querySelector(".binary-image-space");
const detectedImageSpace = document.querySelector(".detected-image-space");
const binaryImage = document.querySelector(".binary-image");
const detectedImage = document.querySelector(".detected-image");
const loadingIcon = document.querySelector(".loading-icon");

const upload = document.querySelector(".sidebar__file input");
let report_data;
let layout_report;
let alignment_report;
let contrast_report;
let spelling_report;
let image_report;
const testSelections = document.querySelector(".sidebar__list");
const report = document.querySelector(".report");

if (formParas) {
  formParas.addEventListener("submit", function (e) {
    e.preventDefault();

    const FR = new FileReader();
    FR.readAsDataURL(photo.files[0]);

    FR.addEventListener("load", async function (e) {
      loadingIcon.classList.remove("hidden");
      const res = await fetch("http://127.0.0.1:5000/test_parameters", {
        method: "POST",
        body: JSON.stringify({
          image: this.result,
          bin_grad: sliders[0].value,
          min_ele_area: sliders[1].value,
        }),
      });
      const data = await res.json();

      loadingIcon.classList.add("hidden");
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

if (formTests) {
  formTests.addEventListener("submit", async function (e) {
    e.preventDefault();

    const checkboxes = document.querySelectorAll(".form__checkbox");
    const values = [...checkboxes].map((checkbox) => checkbox.checked);

    const res = await fetch("http://127.0.0.1:5000/select_tests", {
      method: "POST",
      body: JSON.stringify({
        layout: values[0],
        alignment: values[1],
        text_contrast: values[2],
        spelling: values[3],
        images: values[4],
      }),
    });

    const data = await res.json();
    if (data.status === "success")
      location.assign("http://127.0.0.1:5501/detector.html");
  });
}

if (upload) {
  upload.addEventListener("change", function (e) {
    const FR = new FileReader();
    FR.readAsDataURL(this.files[0]);
    console.log(this.files[0]);

    FR.addEventListener("load", async function (e) {
      try {
        const res = await fetch("http://127.0.0.1:5000/ui_check", {
          method: "POST",
          body: JSON.stringify({
            image: this.result,
          }),
        });

        report_data = await res.json();
        console.log(report_data);

        layout_report = report_data.layout_test;
        alignment_report = report_data.alignment_test;
        contrast_report = report_data.contrast_test;
        spelling_report = report_data.spelling_test;
        image_report = report_data.image_test;
      } catch (err) {
        console.error(err);
      }
    });
  });
}

if (testSelections) {
  testSelections.addEventListener("click", function (e) {
    if (!report_data) return;

    const id = e.target.id;
    if (id === "layout_btn") {
      report.src = layout_report.image;
    } else if (id === "alignment_btn") {
      report.src = alignment_report.row_center;
    } else if (id === "contrast_btn") {
      report.src = contrast_report.image;
    } else if (id === "spelling_btn") {
      report.src = spelling_report.image;
    } else if (id === "images_btn") {
      report.src = image_report.image;
    }
  });
}

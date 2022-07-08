const formParas = document.querySelector('.form--paras');
const formTests = document.querySelector('.form--tests');

const sliders = document.querySelectorAll('.slider input');
const photo = document.querySelector('.input--photo');
const binaryImageSpace = document.querySelector('.binary-image-space');
const detectedImageSpace = document.querySelector('.detected-image-space');
const binaryImage = document.querySelector('.binary-image');
const detectedImage = document.querySelector('.detected-image');
const loadingIcon = document.querySelector('.loading-icon');
const sidebarDefects = document.querySelector('.sidebar-defects');
const sideBarTestTypes = document.querySelectorAll('.sidebar__item--btn');

let testTypes;

const upload = document.querySelector('.sidebar__file input');
const imageName = document.getElementById('image__name');
let report_data;
let image_name;
let layout_report;
let alignment_report;
let contrast_report;
let spelling_report;
let grammar_report;
let image_report;
const testSelections = document.querySelector('.sidebar__list');
const report = document.querySelector('.report');
const labelLoaders = document.querySelectorAll('.loader');
const sideBarIcons = document.querySelectorAll('.sidebar__icon');
const resultInfoSection = document.querySelector('.sidebar__list--defects');
const screenshot = document.querySelector('.screenshot');

const contrastTick = document.getElementById('contrast_tick');
const spellingTick = document.getElementById('spelling_tick');
const alignmentTick = document.getElementById('alignment_tick');
const layoutTick = document.getElementById('layout_tick');
const grammarTick = document.getElementById('grammar_tick');
const imageTick = document.getElementById('image_tick');

const selectDefects = () => {
  const items = document.querySelectorAll('.sidebar-defect__item');
  items.forEach(item =>
    item.addEventListener('click', function (e) {
      this.nextElementSibling.classList.toggle('active');
    })
  );
};

if (formParas) {
  formParas.addEventListener('submit', function (e) {
    e.preventDefault();

    const FR = new FileReader();
    FR.readAsDataURL(photo.files[0]);

    FR.addEventListener('load', async function (e) {
      loadingIcon.classList.remove('hidden');
      try {
        const res = await fetch('http://127.0.0.1:5000/test_parameters', {
          method: 'POST',
          body: JSON.stringify({
            image: this.result,
            bin_grad: sliders[0].value,
            min_ele_area: sliders[1].value,
          }),
        });
        const data = await res.json();

        loadingIcon.classList.add('hidden');
        binaryImageSpace.classList.remove('hidden');
        detectedImageSpace.classList.remove('hidden');
        binaryImage.src = data.binary_img;
        detectedImage.src = data.detected_img;
      } catch (err) {
        console.error(err);
      }
      // const img = document.createElement("img");
      // img.src = this.result;
      // document.body.append(img);
    });
  });
}

if (sliders) {
  sliders.forEach(slider => {
    slider.addEventListener('input', function (e) {
      const label = this.nextElementSibling;
      label.innerHTML = this.value;
    });
  });
}

if (formTests) {
  formTests.addEventListener('submit', async function (e) {
    e.preventDefault();

    const checkboxes = document.querySelectorAll('.form__checkbox');
    const values = [...checkboxes].map(checkbox => checkbox.checked);
    document.cookie = values;

    try {
      const res = await fetch('http://127.0.0.1:5000/select_tests', {
        method: 'POST',
        body: JSON.stringify({
          layout: values[0],
          alignment: values[1],
          text_contrast: values[2],
          spelling: values[3],
          grammar: values[4],
          images: values[5],
        }),
      });

      const data = await res.json();
      if (data.status === 'success') location.assign('/detector.html');
    } catch (err) {
      console.error(err);
    }
  });
}

if (upload) {
  testTypes = document.cookie.split(',');
  console.log(testTypes);
  let i = 0;
  sideBarTestTypes.forEach(btn => {
    console.log(testTypes[i]);
    if (testTypes[i] == 'false') {
      btn.classList.add('hidden');
    }
    i++;
  });

  upload.addEventListener('change', function (e) {
    if (!this.files[0]) return;

    resultInfoSection.innerHTML = '';
    screenshot.innerHTML = '';

    sideBarIcons.forEach(icon => {
      icon.classList.add('hidden');
    });

    labelLoaders.forEach(icon => {
      icon.classList.remove('hidden');
    });

    const FR = new FileReader();
    FR.readAsDataURL(this.files[0]);
    console.log(this.files[0]);

    FR.addEventListener('load', async function (e) {
      try {
        const res = await fetch('http://127.0.0.1:5000/ui_check', {
          method: 'POST',
          body: JSON.stringify({
            image: this.result,
          }),
        });

        report_data = await res.json();
        labelLoaders.forEach(icon => {
          icon.classList.add('hidden');
        });
        sideBarIcons.forEach(icon => {
          icon.classList.remove('hidden');
          icon.classList.add('sidebar__icon--green');
        });
        console.log(report_data);

        image_name = report_data.image_info.image_name;
        layout_report = report_data.layout_test;
        alignment_report = report_data.alignment_test;
        contrast_report = report_data.contrast_test;
        spelling_report = report_data.spelling_test;
        grammar_report = report_data.grammar_test;
        image_report = report_data.image_test;
        console.log(image_name);
        imageName.innerText = image_name;
      } catch (err) {
        console.error(err);
      }
    });
  });
}

if (testSelections) {
  testSelections.addEventListener('click', function (e) {
    resultInfoSection.innerHTML = '';
    screenshot.innerHTML = '';

    if (!report_data) return;

    const id = e.target.id;

    if (id === 'layout_btn') {
      // report.src = layout_report.image;
      const html = `<img class="report" src="${layout_report.image}" alt="" />`;
      screenshot.insertAdjacentHTML('beforeend', html);

      Object.keys(layout_report.report).forEach(x => {
        console.log(x);
        // const html = `<li class="sidebar-defect__item">
        //               <button class="sidebar__btn">${x}</button>
        //               </li>
        //               <div class="sidebar-defects__defect">
        //                 <p class="info">
        //                   ${layout_report.report[x].info}
        //                 </p>
        //               </div>`;
        const html = `
          <p class="info" style="padding:1rem; font-size:1.5rem">
            ${layout_report.report[x]}
          </p>`;
        resultInfoSection.insertAdjacentHTML('beforeend', html);
      });
      selectDefects();
    }
    if (id === 'alignment_btn') {
      var reportNum = 'report';
      var count = 0;

      Object.keys(alignment_report).forEach(x => {
        var image_src = alignment_report[x];

        count = count + 1;
        reportNum = 'report' + count;

        const html = `<hr/>
                      <p id=${reportNum} >Report of Alignment: ${x}</p>
                      <img class=${reportNum} src="${image_src}" alt="" />
                      <hr/>
                      <br/>`;

        var reportLink = '#' + reportNum;
        const htmlLinks = `<li class="sidebar-defect__item">
                            <button onclick="location.href='${reportLink}'" class="sidebar__btn">Report: ${x}</button>
                            </li>`;

        screenshot.insertAdjacentHTML('beforeend', html);
        resultInfoSection.insertAdjacentHTML('beforeend', htmlLinks);
      });
    }
    if (id === 'contrast_btn') {
      // report.src = contrast_report.image;
      const html = `<img class="report" src="${contrast_report.image}" alt="" />`;
      screenshot.insertAdjacentHTML('beforeend', html);

      Object.keys(contrast_report.report).forEach(x => {
        console.log(x);
        console.log(contrast_report.report[x]);
        console.log(contrast_report.report[x]);
        if (contrast_report.report[x].test === 'fail') {
          contrastTick.classList.add('sidebar__icon--red');
          const html = `<li class="sidebar-defect__item">
                        <button class="sidebar__btn">Issue: ${contrast_report.report[x].num}</button>
                        </li>
                        <div class="sidebar-defects__defect">
                          <p class="info">Text:
                            ${contrast_report.report[x].content}
                          </p>
                          <p class="info">Contrast level: 
                            ${contrast_report.report[x].contrast_lvl}
                          </p>
                          <p class="info">Expected minimum contrast level: 
                            ${contrast_report.report[x].expected}
                          </p>
                        </div>`;
          resultInfoSection.insertAdjacentHTML('beforeend', html);
        }
      });
      selectDefects();
    }
    if (id === 'spelling_btn') {
      // report.src = spelling_report.image;
      const html = `<img class="report" src="${spelling_report.image}" alt="" />`;
      screenshot.insertAdjacentHTML('beforeend', html);

      Object.keys(spelling_report.report).forEach(x => {
        console.log(x);
        console.log(spelling_report.report[x]);
        console.log(spelling_report.report[x]);
        if (spelling_report.report[x].test === 'fail') {
          spellingTick.classList.add('sidebar__icon--red');
          const html = `<li class="sidebar-defect__item">
                        <button class="sidebar__btn">Issue: ${spelling_report.report[x].num}</button>
                        </li>
                        <div class="sidebar-defects__defect">
                          <p class="info">
                            Word:
                            ${spelling_report.report[x].word}
                          </p>
                          <p class="info">
                            Corrected: 
                            ${spelling_report.report[x].corrected}
                          </p>
                          <p class="info">
                            Suggestions: 
                            ${spelling_report.report[x].suggestions}
                          </p>
                        </div>`;
          resultInfoSection.insertAdjacentHTML('beforeend', html);
        }
      });
      selectDefects();
    }
    if (id === 'grammar_btn') {
      const html = `<img class="report" src="${grammar_report.image}" alt="" />`;
      screenshot.insertAdjacentHTML('beforeend', html);

      Object.keys(grammar_report.report).forEach(x => {
        console.log(x);
        console.log(grammar_report.report[x]);
        console.log(grammar_report.report[x]);
        if (grammar_report.report[x].test === 'fail') {
          grammarTick.classList.add('sidebar__icon--red');
          const html = `<li class="sidebar-defect__item">
                        <button class="sidebar__btn">Issue: ${grammar_report.report[x].num}</button>
                        </li>
                        <div class="sidebar-defects__defect">
                          <p class="info">
                            Text:
                            ${grammar_report.report[x].content}
                          </p>
                          <p class="info">
                            Mistake: 
                            ${grammar_report.report[x].mistakes}
                          </p>
                          <p class="info">
                            Correction: 
                            ${grammar_report.report[x].corrections}
                          </p>
                        </div>`;
          resultInfoSection.insertAdjacentHTML('beforeend', html);
        }
      });
      selectDefects();
    }
    if (id === 'images_btn') {
      // report.src = image_report.image;
      const html = `<img class="report" src="${image_report.image}" alt="" />`;
      screenshot.insertAdjacentHTML('beforeend', html);

      Object.keys(image_report.report).forEach(x => {
        console.log(x);
        console.log(image_report.report[x]);
        console.log(image_report.report[x]);
        if (image_report.report[x].test === 'fail') {
          imageTick.classList.add('sidebar__icon--red');
          const html = `<li class="sidebar-defect__item">
                      <button class="sidebar__btn">Issue: ${image_report.report[x].num}</button>
                      </li>
                      <div class="sidebar-defects__defect">
                        <p class="info">Laplacian amount:
                          ${image_report.report[x].laplacian}
                        </p>
                        <p class="info">Required laplacian amount:
                          ${image_report.report[x].threshold}
                        </p>
                      </div>`;
          resultInfoSection.insertAdjacentHTML('beforeend', html);
        }
      });
      selectDefects();
    }
  });
}

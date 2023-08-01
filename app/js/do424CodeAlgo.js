import * as XLSX from "../../xlsx/xlsx.mjs";
var result_all_xlsxs_names = [];

class CodeAlgo {
  /**
   * make the source list group view when finishing uploading
   * @param {*} sourceListGroup
   * @param {*} curFiles
   * @returns source list group view
   */
  static async excel_and_list_and_upload(sourceListGroup, curFiles) {
    sourceListGroup.innerHTML =
      '<a class="list-group-item list-group-item-action disabled list-group-item-dark source-list-group-start"' +
      '              id="list-home-list" data-toggle="list" href="#list-home" role="tab" aria-controls="">源文件列表</a>';
    for (let i = 0; i < curFiles.length; i++) {
      //list a link
      let temp = CodeAlgo.print_excel_panel_and_list(
        curFiles[i],
        "source-excel-panel",
        "source-excel-btns"
      );
      sourceListGroup.appendChild(temp);
    }

    //upload to backend
    console.log("start uploading to the server.");
    await CodeAlgo.callUploadFiles(curFiles);
  }

  /**
   * make the result list group view when finishing coding
   * @param {*} sourceListGroup
   * @param {*} curFiles
   * @returns source list group view
   */
  static async excel_and_list_and_preview(resultListGroup, curFiles) {
    resultListGroup.innerHTML =
      '<a class="list-group-item list-group-item-action disabled list-group-item-dark" id="list-home-list"' +
      '              data-toggle="list" href="#list-home" role="tab" aria-controls="">结果文件列表</a>';
    for (let i = 0; i < curFiles.length; i++) {
      //list a link
      let temp = CodeAlgo.print_excel_panel_and_list(
        curFiles[i],
        "result-excel-panel",
        "result-excel-btns"
      );
      resultListGroup.appendChild(temp);
    }
  }

  /**
   * print_excel_panel_and_list
   * @param {*} fileTemp
   */
  static print_excel_panel_and_list(fileTemp, excelPanel, excelBtns) {
    let temp = document.createElement("a");
    temp.className =
      "list-group-item list-group-item-action list-group-item-dark";
    temp.id = fileTemp.name;
    let dataToggle = document.createAttribute("data-toggle");
    dataToggle.value = "list";
    temp.setAttributeNode(dataToggle);
    let role = document.createAttribute("role");
    role.value = "tab";
    temp.setAttributeNode(role);
    temp.href = "";
    let ariaControls = document.createAttribute("aria-controls");
    ariaControls.value = fileTemp.name;
    temp.setAttributeNode(ariaControls);
    temp.innerHTML = fileTemp.name;
    //point to excel
    temp.addEventListener("click", async (event) => {
      var container = document.getElementById(excelPanel);
      var btns = document.getElementById(excelBtns);
      container.innerHTML = "";
      btns.innerHTML = "";
      const data = await fileTemp.arrayBuffer();
      const workbook = XLSX.read(data);
      var wsnames = workbook.SheetNames;
      console.log(wsnames);
      // multiple sheets transfer
      for (const sheetName of wsnames) {
        console.log(sheetName);
        let btn = document.createElement("button");
        btn.className = "btn btn-secondary btn-lg custom_button_sheet";
        btn.innerHTML = sheetName;
        btn.addEventListener("click", (event) => {
          container.innerHTML = "";
          var worksheet = workbook.Sheets[sheetName];
          let div_temp = document.createElement("div");
          div_temp.innerHTML = XLSX.utils.sheet_to_html(worksheet, {
            header: "Sheet Name: " + sheetName,
          });
          container.appendChild(div_temp);
        });
        btns.appendChild(btn);
      }
    });
    return temp;
  }

  /**
   * upload file to server
   * @param {*} curFiles
   */
  static async callUploadFiles(curFiles) {
    // let domain = "http://192.168.3.9:9092";
    let domain = "http://127.0.0.1:5000";
    console.log(domain + "/code/do424Upload");
    var customForm = document.querySelector(".custom_form");
    customForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(customForm);
      axios
        .post(domain + "/code/do424Upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache",
          },
          validateStatus: function (status) {
            return (status >= 200 && status < 300) || status == 304;
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.flag) {
            alert("源文件上传成功");
          } else {
            alert("源文件上传失败，请稍后再试");
          }
          console.log("finish upload in server.");
        })
        .catch((error) => {
          alert("源文件上传失败，请稍后再试");
          console.log("finish upload in server.");
        });
    });
  }

  /**
   * start code
   */
  static async startCode() {
    console.log("start 424 code.");
    // let domain = "http://192.168.3.9:9092";
    let domain = "http://127.0.0.1:5000";
    console.log(domain + "/code/do424Code");
    await axios
      .get(domain + "/code/do424Code", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache",
        },
        validateStatus: function (status) {
          return (status >= 200 && status < 300) || status == 304;
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data.flag == 1) {
          alert("编码成功");
          result_all_xlsxs_names = res.data.result_all_xlsxs;
          CodeAlgo.showCodeDebugMsg(res.data.result_all_xlsxs);
          CodeAlgo.showResultCodeList(result_all_xlsxs_names);
        } else if(res.data.flag == 2){
            alert("编码失败");
            result_all_xlsxs_names = res.data.result_all_xlsxs;
            CodeAlgo.showCodeDebugMsg(res.data.result_all_xlsxs);
        }
        else {
          alert("编码失败，请稍后再试");
        }
        console.log("finish 424 code.");
      })
      .catch((error) => {
        console.error(error);
        alert("编码失败，请稍后再试");
        console.log("finish 424 code.");
      });
  }

  /**
   * show code result title list
   * @param {*} result_all_xlsxs_names
   */
  static showResultCodeList(result_all_xlsxs_names) {
    for (let each of result_all_xlsxs_names) {
      let attrList = Object.keys(each);
      // let downloadName = "output-" + each[attrList['file']];
      let downloadName = "output-" + each["file"];
      this.downloadSingleCode(downloadName);
      //add to result list
      this.addToResultList(each["file"]);
    }
  }

  /**
   * sub method for showResultCodeList
   * @param {*} each
   */
  static addToResultList(each) {
    //list a link
    let temp = document.createElement("a");
    temp.className =
      "list-group-item list-group-item-action list-group-item-dark";
    temp.id = each;
    let dataToggle = document.createAttribute("data-toggle");
    dataToggle.value = "list";
    temp.setAttributeNode(dataToggle);
    let role = document.createAttribute("role");
    role.value = "tab";
    temp.setAttributeNode(role);
    temp.href = "";
    let ariaControls = document.createAttribute("aria-controls");
    ariaControls.value = each;
    temp.setAttributeNode(ariaControls);
    temp.innerHTML = "output-" + each;
    //point to excel
    // temp.addEventListener('click', async (event) => {
    //     var container = document.getElementById("result-excel-panel");
    //     container.innerHTML = '';
    //     const data = await each.arrayBuffer();
    //     const workbook = XLSX.read(data);
    //     var wsnames = workbook.SheetNames;
    //     console.log(wsnames)
    //     // multiple sheets transfer
    //     for (const sheetName of wsnames) {
    //         var worksheet = workbook.Sheets[sheetName];
    //         let div_temp = document.createElement('div');
    //         div_temp.innerHTML = XLSX.utils.sheet_to_html(worksheet, { header: "Sheet Name: " + sheetName });
    //         container.appendChild(div_temp);
    //     }
    // });
    var resultListGroup = document.querySelector(".result-list-group");
    resultListGroup.appendChild(temp);
  }

  /**
   * download single file
   * @param {*} filenameParam
   */
  static async downloadSingleCode(filenameParam) {
    console.log("download 424 code.");
    // let domain = "http://192.168.3.9:9092";
    let domain = "http://127.0.0.1:5000";
    console.log(domain + "/code/do424Download");
    await axios
      .get(domain + "/code/do424Download", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache",
        },
        params: {
          filename: filenameParam,
        },
        validateStatus: function (status) {
          return (status >= 200 && status < 300) || status == 304;
        },
      })
      .then((res) => {
        console.log(res);
        if (res.status == 200) {
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // IE
            window.navigator.msSaveOrOpenBlob(blob, fileName);
            window.navigator.msSaveOrOpenBlob(blob);
          } else {
            let downFile = document.createElement("a");
            downFile.style.display = "none";
            downFile.href = res.request.responseURL;
            document.body.appendChild(downFile);
            downFile.click();
            document.body.removeChild(downFile); // 下载完成移除元素
          }
          alert("下载成功");
        } else {
          alert("下载失败，请稍后再试");
        }
        console.log("Finish downloading 424 code.");
      })
      .catch((error) => {
        alert("下载失败，请稍后再试");
        console.error(error);
        console.log("Finish downloading 424 code.");
      });
  }

  /**
   * show debug msg in panel
   * @param {*} result_all_xlsxs
   */
  static showCodeDebugMsg(result_all_xlsxs) {
    var coding_msg_panel = document.querySelector(".coding-msg-panel");
    coding_msg_panel.innerHTML = "";
    let ordered_array = [];
    for (let each of result_all_xlsxs) {
      for (var key in each) {
        ordered_array.push(key);
      }
      for (var index of ordered_array) {
        let temp = document.createElement("div");
        temp.innerHTML += each[index];
        var coding_msg_panel = document.querySelector(".coding-msg-panel");
        coding_msg_panel.appendChild(temp);
      }

      // let attrList = Object.keys(each)
      // for (let attr of attrList) {
      //     let temp = document.createElement('div');
      //     temp.id = attr;
      //     // temp.innerHTML = attr + ": ";
      //     temp.innerHTML += each[attr];
      //     var coding_msg_panel = document.querySelector('.coding-msg-panel');
      //     coding_msg_panel.appendChild(temp);
      // }
      var coding_msg_panel = document.querySelector(".coding-msg-panel");
      coding_msg_panel += "<br>";
    }
  }
}

export default CodeAlgo;

import * as XLSX from "../../xlsx/xlsx.mjs";
var result_all_xlsxs_names = [];

class CodeAlgo {
  /**
   * 上传完源文件后进行源文件excel预览
   * @param {*} sourceListGroup
   * @param {*} curFiles
   * @returns source list group view
   */
  static async excel_and_list_and_upload(sourceListGroup, curFiles) {
    //首先恢复初始样式
    sourceListGroup.innerHTML =
      '<a class="list-group-item list-group-item-action disabled list-group-item-dark source-list-group-start"' +
      '              id="list-home-list" data-toggle="list" href="#list-home" role="tab" aria-controls="">源文件列表</a>';
    for (let i = 0; i < curFiles.length; i++) {
      //文件添加到源文件预览
      let temp = CodeAlgo.print_excel_panel_and_list(
        curFiles[i],
        "source-excel-panel",
        "source-excel-btns"
      );
      sourceListGroup.appendChild(temp);
    }

    //源文件上传到后端
    console.log("源文件开始上传至服务器.");
    await CodeAlgo.callUploadFiles(curFiles);
  }

  /**
   * 用户上传任意表格文件后进行excel预览
   * @param {*} sourceListGroup
   * @param {*} curFiles
   * @returns source list group view
   */
  static async excel_and_list_and_preview(resultListGroup, curFiles) {
    //首先恢复初始样式
    resultListGroup.innerHTML =
      '<a class="list-group-item list-group-item-action disabled list-group-item-dark" id="list-home-list"' +
      '              data-toggle="list" href="#list-home" role="tab" aria-controls="">结果文件列表</a>';
    for (let i = 0; i < curFiles.length; i++) {
      //文件添加到结果文件预览
      let temp = CodeAlgo.print_excel_panel_and_list(
        curFiles[i],
        "result-excel-panel",
        "result-excel-btns"
      );
      resultListGroup.appendChild(temp);
    }
  }

  /**
   * 在源文件列表列出并预览excel文件
   * @param {*} fileTemp
   */
  static print_excel_panel_and_list(fileTemp, excelPanel, excelBtns) {
    //创建a标签用于文件列表展示
    let temp = document.createElement("a");
    //a标签的样式
    temp.className =
      "list-group-item list-group-item-action list-group-item-dark";
    //a标签的id
    temp.id = fileTemp.name;
    //a标签的动态交互
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
    //转换成可预览的excel
    temp.addEventListener("click", async (event) => {
      //excel预览框
      var container = document.getElementById(excelPanel);
      //sheet 按钮栏
      var btns = document.getElementById(excelBtns);
      //每次添加前首先清空上一次已经添加的文件
      container.innerHTML = "";
      btns.innerHTML = "";
      //将文件转成二进制数组方便xlsx插件转换
      const data = await fileTemp.arrayBuffer();
      //workbook为sheet页面
      const workbook = XLSX.read(data);
      var wsnames = workbook.SheetNames;
      console.log(wsnames);
      // 对所有sheet进行按钮添加
      for (const sheetName of wsnames) {
        console.log(sheetName);
        let btn = document.createElement("button");
        //按钮的样式
        btn.className = "btn btn-secondary btn-lg custom_button_sheet";
        btn.innerHTML = sheetName;
        //给这个sheet按钮添加点击事件
        btn.addEventListener("click", (event) => {
          container.innerHTML = "";
          var worksheet = workbook.Sheets[sheetName];
          let div_temp = document.createElement("div");
          //调用sheet转html
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
   * 上传文件到服务器
   * @param {*} curFiles
   */
  static async callUploadFiles(curFiles) {
    // let domain = "http://192.168.3.9:9092";
    let domain = "http://127.0.0.1:9092";
    console.log(domain + "/code/do424Upload");
    var customForm = document.querySelector(".custom_form");
    customForm.addEventListener("submit", (e) => {
      //阻止表单提交的默认跳转页面操作
      //test
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
          console.log("上传程序结束");
        })
        .catch((error) => {
          alert("源文件上传失败，请稍后再试");
          console.log("上传程序结束");
        });
    });
  }

  /**
   * 开始424编码
   */
  static async startCode() {
    console.log("开始对源文件编码.");
    // let domain = "http://192.168.3.9:9092";
    let domain = "http://127.0.0.1:9092";
    console.log(domain + "/code/do424Code");
    //调用后端424编码接口
    await axios
      .get(domain + "/code/do424Code", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache",
        },
        //验证后端返回状态
        validateStatus: function (status) {
          return (status >= 200 && status < 300) || status == 304;
        },
      })
      .then((res) => {
        //res即接收到的结果
        console.log(res);
        if (res.data.flag == 1) {
          //后端编码成功，显示debug信息，下载结果文件
          alert("编码成功");
          result_all_xlsxs_names = res.data.result_all_xlsxs;
          CodeAlgo.showCodeDebugMsg(res.data.result_all_xlsxs);
          CodeAlgo.showResultCodeList(result_all_xlsxs_names);
        } else if(res.data.flag == 2){
            //后端编码失败，流程中出现错误，显示目前已经产生的debug信息
            alert("编码失败");
            result_all_xlsxs_names = res.data.result_all_xlsxs;
            CodeAlgo.showCodeDebugMsg(res.data.result_all_xlsxs);
        }
        else {
          alert("编码失败，请稍后再试");
        }
        console.log("424编码程序结束.");
      })
      .catch((error) => {
        console.error(error);
        alert("编码失败，请稍后再试");
        console.log("424编码程序结束.");
      });
  }

  /**
   * 下载编码后的文件并将该文件添加到结果文件列表
   * @param {*} result_all_xlsxs_names
   */
  static showResultCodeList(result_all_xlsxs_names) {
    for (let each of result_all_xlsxs_names) {
      let attrList = Object.keys(each);
      // let downloadName = "output-" + each[attrList['file']];
      let downloadName = "output-" + each["file"];
      //下载文件
      this.downloadSingleCode(downloadName);
      //添加到结果文件列表
      this.addToResultList(each["file"]);
    }
  }

  /**
   * 将文件添加到结果列表
   * @param {*} each
   */
  static addToResultList(each) {
    //创建可以添加到结果列表的a标签
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
    var resultListGroup = document.querySelector(".result-list-group");
    //在列表中添加该a标签
    resultListGroup.appendChild(temp);
  }

  /**
   * 根据文件名称下载单个文件
   * @param {*} filenameParam
   */
  static async downloadSingleCode(filenameParam) {
    console.log("下载424编码.");
    // let domain = "http://192.168.3.9:9092";
    let domain = "http://127.0.0.1:9092";
    //调用后端下载文件接口
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
            // IE浏览器
            window.navigator.msSaveOrOpenBlob(blob, fileName);
            window.navigator.msSaveOrOpenBlob(blob);
          } else {
            //非IE浏览器 创建a标签模拟点击下载
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
        console.log("424下载程序结束.");
      })
      .catch((error) => {
        alert("下载失败，请稍后再试");
        console.error(error);
        console.log("424下载程序结束.");
      });
  }

  /**
   * 在信息框中展示debug信息
   * @param {*} result_all_xlsxs
   */
  static showCodeDebugMsg(result_all_xlsxs) {
    var coding_msg_panel = document.querySelector(".coding-msg-panel");
    coding_msg_panel.innerHTML = "";
    //创建数组存储返回信息，用于维护展示信息的顺序
    let ordered_array = [];
    for (let each of result_all_xlsxs) {
      for (var key in each) {
        //把返回的字典的所有key存在数组中
        ordered_array.push(key);
      }
      for (var index of ordered_array) {
        //根据数组中存储的每个key拿到对应的debug信息值
        let temp = document.createElement("div");
        temp.innerHTML += each[index];
        var coding_msg_panel = document.querySelector(".coding-msg-panel");
        //添加每个div的debug信息
        coding_msg_panel.appendChild(temp);
      }
      //换行
      var coding_msg_panel = document.querySelector(".coding-msg-panel");
      coding_msg_panel += "<br>";
    }
  }
}

export default CodeAlgo;

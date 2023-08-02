import { default as CodeAlgo } from './do424CodeAlgo.js';

/**
 * 索引需要添加交互的html元素
 */
var sourceFilesUploader = document.querySelector('#source-files-uploader');
var resultFilesUploader = document.querySelector('#result-files-uploader');
var startCodeButton = document.querySelector('.start_code_button');
// var downloadCodeButton = document.querySelector('.download_code_button');
/**
 * 文件上传和源文件列表显示
 */
sourceFilesUploader.addEventListener("change", (event) => {
    //拿到上传在浏览器缓存区的文件
    const curFiles = sourceFilesUploader.files;
    sourceFilesUploader.files = curFiles;
    console.log(curFiles);
    let sourceListGroup = document.querySelector('.source-list-group');
    var container = document.getElementById("source-excel-panel");
    var btnsPanel = document.getElementById("source-excel-btns");
    if (curFiles.length === 0) {
        console.log("没有选择文件上传，删除已经在源文件列表中的上传历史.")
        //清空excel预览面板的显示
        sourceFilesUploader.files = null;
        container.innerHTML = '';
        btnsPanel.innerHTML = '';
        sourceListGroup.innerHTML = '<a class="list-group-item list-group-item-action disabled list-group-item-dark source-list-group-start"' +
            '              id="list-home-list" data-toggle="list" href="#list-home" role="tab" aria-controls="">源文件列表</a>';
    } else {
        console.log("源文件上传完成后，展示源文件列表.");
        //调用接口进行上传和预览表格
        CodeAlgo.excel_and_list_and_upload(sourceListGroup, curFiles);
    }

});


/**
 * 网页端预览编码excel表格
 */
resultFilesUploader.addEventListener('change',(event) => {
    //拿到上传在浏览器缓存区的文件
    const curFiles = resultFilesUploader.files;
    resultFilesUploader.files = curFiles;
    console.log(curFiles);
    let resultListGroup = document.querySelector('.result-list-group');
    var container = document.getElementById("result-excel-panel");
    var btnsPanel = document.getElementById("result-excel-btns");
    if (curFiles.length === 0) {
        console.log("没有选择文件上传，删除已经在结果文件列表中的上传历史.")
        //清空excel预览面板的显示
        resultListGroup.files = null;
        container.innerHTML = '';
        btnsPanel.innerHTML = '';
        resultListGroup.innerHTML = '<a class="list-group-item list-group-item-action disabled list-group-item-dark source-list-group-start"' +
            '              id="list-home-list" data-toggle="list" href="#list-home" role="tab" aria-controls="">结果文件列表</a>';
    } else {
        console.log("结果文件上传完成后，展示源文件列表.");
        CodeAlgo.excel_and_list_and_preview(resultListGroup,curFiles);
    }
})


/**
 * 给按钮绑定编码接口
 */
startCodeButton.addEventListener('click',(event)=> {
    CodeAlgo.startCode();

})














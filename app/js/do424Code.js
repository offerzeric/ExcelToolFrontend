import { default as CodeAlgo } from './do424CodeAlgo.js';

/**
 * global var declare
 */
var sourceFilesUploader = document.querySelector('#source-files-uploader');
var resultFilesUploader = document.querySelector('#result-files-uploader');
var startCodeButton = document.querySelector('.start_code_button');
// var downloadCodeButton = document.querySelector('.download_code_button');
/**
 * do upload and source list update
 */
sourceFilesUploader.addEventListener("change", (event) => {
    const curFiles = sourceFilesUploader.files;
    sourceFilesUploader.files = curFiles;
    console.log(curFiles);
    let sourceListGroup = document.querySelector('.source-list-group');
    var container = document.getElementById("source-excel-panel");
    var btnsPanel = document.getElementById("source-excel-btns");
    if (curFiles.length === 0) {
        console.log("no files upload, delete all the files in source list group.")
        sourceFilesUploader.files = null;
        container.innerHTML = '';
        btnsPanel.innerHTML = '';
        sourceListGroup.innerHTML = '<a class="list-group-item list-group-item-action disabled list-group-item-dark source-list-group-start"' +
            '              id="list-home-list" data-toggle="list" href="#list-home" role="tab" aria-controls="">源文件列表</a>';
    } else {
        console.log("show the source files list after uploading.");
        CodeAlgo.excel_and_list_and_upload(sourceListGroup, curFiles);
    }

});


/**
 * preview code excel
 */
resultFilesUploader.addEventListener('change',(event) => {
    const curFiles = resultFilesUploader.files;
    resultFilesUploader.files = curFiles;
    console.log(curFiles);
    let resultListGroup = document.querySelector('.result-list-group');
    var container = document.getElementById("result-excel-panel");
    var btnsPanel = document.getElementById("result-excel-btns");
    if (curFiles.length === 0) {
        console.log("no files upload, delete all the files in source list group.")
        resultListGroup.files = null;
        container.innerHTML = '';
        btnsPanel.innerHTML = '';
        resultListGroup.innerHTML = '<a class="list-group-item list-group-item-action disabled list-group-item-dark source-list-group-start"' +
            '              id="list-home-list" data-toggle="list" href="#list-home" role="tab" aria-controls="">结果文件列表</a>';
    } else {
        console.log("show the result files list after coding.");
        CodeAlgo.excel_and_list_and_preview(resultListGroup,curFiles);
    }
})


/**
 * start code
 */
startCodeButton.addEventListener('click',(event)=> {
    CodeAlgo.startCode();

})














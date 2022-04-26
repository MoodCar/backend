const axios = require("axios");

const {
  Diary,
  idValid,
  diaryIdValid,
  contentExist,
} = require("../models/diary.model.js");
const sql = require("../models/db.js");

// 일기 작성
exports.write = (req, res) => {
  const diary = new Diary(req.body);
  const idvalid = new idValid(req.body);
  idValid.validate(req.params.providerId, idvalid, (err, data) => {
    if (err) {
      res.json({
        isSuccess: false,
        code: 400,
        message: "request to create diary is incorrect or corrupt",
      });
    }
    if (data === 0) {
      res.json({
        isSuccess: false,
        code: 404,
        message: "ID does not exist",
      });
    } else {
      const contentexist = new contentExist(req.body);
      contentExist.isExist(req.body.content, contentexist, (err, data) => {
        if (err) {
          res.json({
            isSuccess: false,
            code: 400,
            message: "request to create diary is incorrect or corrupt",
          });
        }
        if (data === 0) {
          res.json({
            isSuccess: false,
            code: 400,
            message: "Please write a diary content",
          });
        } else {
          Diary.alreadyExist(req.params.providerId, (err, data) => {
            if (err) {
              res.json({
                isSuccess: false,
                code: 400,
                message: "request to create diary is incorrect or corrupt",
              });
            }
            if (data === 0) {
              res.json({
                isSuccess: false,
                code: 400,
                message: "You already wrote a diary today",
              });
            } else {
              Diary.write(req.params.providerId, diary, (err, data) => {
                if (err) {
                  res.json({
                    isSuccess: false,
                    code: 400,
                    message: "request to create diary is incorrect or corrupt",
                  });
                } else {
                    axios.post(
                      "http://3.34.209.23:5000/prediction",
                      {
                        content: req.body.content,
                      }
                    ).then((response)=>{
                      Diary.updateEmotion(data,response.data.emotion,(err) =>{
                        if(err){
                          res.json({
                            isSuccess: false,
                            code: 400,
                            message: "request to create diary is incorrect or corrupt",
                          });
                        }
                        else{
                          res.json({
                            isSuccess: true,
                            code: 200,
                            emotion: response.data.emotion,
                          });
                        }
                      })
                    })
                  };
                })
              }});
            }
          });
        }
      });
    }

// Diary 아이디 별 삭제
exports.delete = (req, res) => {
  const diaryidvalid = new diaryIdValid(req.body);
  diaryIdValid.validate(req.params.id, diaryidvalid, (err, data) => {
    if (err) {
      res.json({
        isSuccess: false,
        code: 400,
        message: "request to delete diary by diaryID is incorrect or corrupt",
      });
    }
    if (data === 0) {
      res.json({
        isSuccess: false,
        code: 404,
        message: "Diary ID does not exist",
      });
    } else {
      Diary.delete(req.params.id, (err, data) => {
        if (err) {
          res.json({
            isSuccess: false,
            code: 400,
            message:
              "request to delete diary by diaryID is incorrect or corrupt",
          });
        } else {
          res.json({
            isSuccess: true,
            code: 200,
            data,
          });
        }
      });
    }
  });
};

// Diary 사용자 아이디 별 조회
exports.findById = (req,res) => {
  const idvalid = new idValid(req.body);
  idValid.validate(req.params.providerId,idvalid,(err,data)=>{
      if(err){
          res.json({
              isSuccess: false,
              code: 400,
              message: "request to get diary by providerId is incorrect or corrupt"
          });
      }
      if(data === 0){
          res.json({
              isSuccess: false,
              code: 404,
              message: "ID does not exist"
          })
      }else{
          Diary.noList(req.params.providerId,(err,data)=>{
              if(err){
                  res.json({
                      isSuccess: false,
                      code: 400,
                      message: "request to get diary by providerId is incorrect or corrupt"
                  });
              }
              if(data === 0){
                  res.json({
                      isSuccess: false,
                      code: 400,
                      message: "There is no diary list"
                  });
              }else{
                  Diary.getById(req.params.providerId,(err,data) => {
                      if(err){
                          res.json({
                              isSuccess: false,
                              code: 400,
                              message: "request to get diary by providerId is incorrect or corrupt"
                          });
                      }else{
                          res.json({
                              isSuccess: true,
                              code: 200,
                              data
                          });
                      }
                  });             
              }
          });
      }
  });
};
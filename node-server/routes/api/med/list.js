// @login &register
const express = require('express');
const router = express.Router();
const passport = require('passport');

const List = require('../../../module/Med_List');

//$route GET api/Lists/test
//@desc 返回的请求的json数据
//@access public
router.get('/test', (req, res) => {
  res.json({
    msg: 'List works',
  });
});

//$route POST api/Lists/add
//@desc 创建信息借口
//@access Private

router.post('/add', (req, res) => {
  const ListFields = {};
  if (req.body.sn) ListFields.sn = req.body.sn;
  if (req.body.vender) ListFields.vender = req.body.vender;
  if (req.body.venderType) ListFields.venderType = req.body.venderType;
  if (req.body.dingdan_time) ListFields.dingdan_time = req.body.dingdan_time;
  if (req.body.data) {
    let ctotal = 0;
    let dtotal = 0;
    ListFields.data = req.body.data;
    for (let i = 0; i < req.body.data.length - 1; i++) {
      let cur = req.body.data[i];
      dtotal += parseInt(cur.quantity) * parseInt(cur.dingdan_price);
      ctotal += parseInt(cur.quantity) * parseInt(cur.caigou_price);
    }
    ListFields.dingdan_totalPrice = dtotal;
    ListFields.caigou_totalPrice = ctotal;
  }
  if (req.body.key) ListFields.key = req.body.key;
  new List(ListFields).save().then(List => {
    res.json({
      status: 'ok',
      data: List,
    });
  });
});

//$route get api/Lists/
//@desc 获取所有信息
//@access Private
router.get('/', (req, res) => {
  List.find()
    .then(List => {
      if (!List) {
        return res.status(404).json('没有任何数据');
      }
      res.json(List);
    })
    .catch(err => res.status(404).json(err));
});

//
router.post('/delete', (req, res) => {
  List.findOneAndRemove({ _id: req.body.id })
    .then(List => {
      List.save();
    })
    .then(() => {
      List.find()
        .then(List => {
          if (!List) {
            return res.status(404).json('没有任何数据');
          }
          res.json(List);
        })
        .catch(err => res.status(404).json(err));
    })
    .catch(err =>
      res.json({
        status: 'error',
        data: List,
      })
    );
});
//查询medlist
router.post('/find', (req, res) => {
  const { name } = req.body;
  List.find(
    { 'data.name': { $eq: name } },
    { vender: 1, venderType: 1, dingdan_time: 1, fahuo_time: 1, 'data.$': 1, _id: 0 }
  ).then(list => {
    res.json({ list, status: 'ok' });
  });
});

//$route get api/Lists/:id
//@desc 获取单个信息
//@access Private
router.get('/:id', (req, res) => {
  List.findOne({ _id: req.params.id })
    .then(list => {
      if (!List) {
        return res.status(404).json('没有任何数据');
      }
      res.json({
        status: 'ok',
        oneList: list,
      });
    })
    .catch(err => res.status(404).json(err));
});

//$route POST api/Lists/edit
//@desc 编辑信息借口
//@access Private

router.post('/edit/:id', (req, res) => {
  let { data } = req.body;
  const { id } = req.params;
  let jiesuan_total = 0,
    dtotal = 0,
    ctotal = 0,
    zbtotal = 0,
    jstotal = 0;
  status = 0;
  if (data) {
    for (let i = 0; i < data.length - 1; i++) {
      let cur = req.body.data[i];

      dtotal += (cur.quantity - cur.back_quantity) * cur.dingdan_price;
      if (cur.zhongbiao) {
        zbtotal++;
        ctotal += (cur.quantity - cur.back_quantity) * cur.caigou_price;
        jiesuan_total += parseInt(cur.settlement);
      }
      if (cur.jiesuan) {
        jstotal++;
      }
    }
    if (jstotal == 0) {
      status = 0;
    } else if (jstotal != 0 && jstotal < zbtotal) {
      status = 1;
    } else {
      status = 2;
    }
  }

  List.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        data,
        status,
        jiesuan_price: jiesuan_total.toFixed(2),
        dingdan_totalPrice: dtotal.toFixed(2),
        caigou_totalPrice: ctotal.toFixed(2),
      },
    }
    //).then(List => res.json({oneList:List,status: 'ok'}));
  ).then(List => res.json({ status: 'ok' }));

  // List.findOneAndUpdate({ _id: req.params.id }, { $set: ListFields }, { new: true }).then(List =>
  //   res.json(List)
  // );

  // if (req.body.uploadData) {
  //   ListFields.uploadData = req.body.uploadData;
  //   let temData = ListFields.uploadData;
  //   for (let i = 0; i < temData.length; i++) {
  //     const cur = temData[i];

  //     ListFields.allStatements += parseInt(cur.statements);
  //     let qty = cur.quantity - parseInt(cur.return);
  //     cur.totlePrice = qty * cur.price;
  //     cur.totleMyPrice = qty * cur.myPrice;
  //     ListFields.allQuantity += qty;
  //     if (cur.quantity * cur.price) ListFields.allPrice += qty * cur.price;
  //     if (cur.quantity * cur.myPrice) ListFields.allMyPrice += qty * cur.myPrice;
  //   }
  // }
  // if (req.body.vender) ListFields.vender = req.body.vender;
  // if (req.body.date) ListFields.date = req.body.date;
  // if (req.body.remark) ListFields.remark = req.body.remark;
  // if (req.body.type) ListFields.type = req.body.type;
});

//更新时间
router.post('/time/:id', (req, res) => {
  let { fahuo_time } = req.body;
  const { id } = req.params;
  List.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        fahuo_time,
      },
    }
  ).then(()=>{
    List.find()
    .then(List => {
      if (!List) {
        return res.status(404).json('没有任何数据');
      }
      res.json(List);
    })
    .catch(err => res.status(404).json(err));
  });
});

//$route POST api/Lists/delete/:id
//@desc 删除信息接口
//@access Private
router.delete('/delete/:id', (req, res) => {
  List.findOneAndRemove({ _id: req.params.id })
    .then(List => {
      List.save().then(List => res.json(List));
    })
    .catch(err => res.status(404).json('删除失败'));
});

module.exports = router;

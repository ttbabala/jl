// pages/pub/wuliu/othercity/othercity.js
var app = new getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    showOcPop: false,
    ishavaData:false,
    nooc:true,
    ocData:[],
    ocArray:[],
    ocname:'',
    yunfei:0,
    selvalue:0
  },

  get_ocname: function (e) {
    var name = 'ocSingle[1].name'
    this.setData({
      [name]: e.detail.value,
      ocname: e.detail.value
    })
  },

  get_price: function(e){
    var yunfei = 'ocSingle[2].yunfei'
    this.setData({
      [yunfei]: e.detail.value,
      yunfei: e.detail.value
    })
  },

  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  /**
  * 弹出框蒙层截断touchmove事件
  */
  preventTouchMove: function () {
  },
  /**
  * 隐藏模态对话
  */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /*
  * 隐藏模态对话框
  */
  hideOcPop: function () {
    this.setData({
      showOcPop: false
    });
  },
  /**
  * 对话框取消按钮点击事件
  */
  onCancel: function () {
    this.hideModal();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.havaocData();
  },

  //载入数据表中异地物流数据
  havaocData: function () {
    var that = this;
    wx.request({
      url: 'http://localhost/jielong/index.php/xcx/Othercity/loadocData/',
      data: {
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var ocDataNum = res.data.data.length; //服务器端数据表中异地物流数据条数
        if (ocDataNum > 0) {
          var ishave = true;    
        } else {
          var ishave = false;
        }
        var goodsData = wx.getStorageSync('pubgoods');
        if (goodsData.oc != '') {
          for (var i = 0; i < res.data.data.length; i++) {
            if (goodsData.oc == res.data.data[i].id) {
              res.data.data[i].checked = true
            } else {
              res.data.data[i].checked = false
            }
          }
        }
        that.setData({
          ishavaData: ishave,
          ocData: res.data.data,  //数据表中对应用户的所有异地物流信息
          nooc: false
        })
        console.log(res.data.data);
      }
    })
  },

  /**
  * 对话框确认按钮点击事件-新增物流
  */
  onConfirm: function () {
    var that = this;
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    if (that.data.ocname == '') {
      warn = "请填写物流名称";
    } else if (that.data.yunfei== '') {
      warn = "请输入运费价格";
    } else {
      flag = false;//若必要信息都填写，则不用弹框      
      that.setData({
        nooc: false //不显示底部背景
      })
      /* 设置全局变量存储异地物流信息*/
      app.globalData.confirmOcNum++;
      var j = app.globalData.confirmOcNum;
      var ocData, ocSingleList = new Array();
      ocData = app.globalData.ocData;
      if (j > 0 && j < 10) {
        var random = Math.random() * 10;
        var id = random.toString().substr(2);
        ocSingleList[j] = [{ 'id': id }, { 'name': that.data.ocname }, { 'yunfei': that.data.yunfei }, { 'checked': false }];
        ocData.push(ocSingleList[j]);
        app.globalData.ocData = ocData;
        that.setData({
          ocArray: ocData
        })
        this.hideModal();
        wx.showModal({
          content: '设置成功！是否要将此次添加的异地物流信息同步到默认设置中去，以便下次使用。',
          success: function (res) {
            if (res.confirm) {
              try {
                //把异地物流信息加入缓存
                wx.setStorageSync('ocinfo', JSON.stringify(that.data.ocArray));
                var ocData = that.data.ocArray;
                var session3rd = wx.getStorageSync('3rd_session');
                console.log(ocData);
                wx.request({
                  url: 'http://localhost/jielong/index.php/xcx/Othercity/addothercity/',
                  data: {
                    ocData: ocData,   //异地物流信息
                    openid: app.globalData.openid
                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success: function (res) {
                    console.log(res.data.data);
                    var ocDataNum = res.data.data.length; //服务器端数据表中异地物流数据条数
                    if (ocDataNum > 0) {
                      var ishave = true;
                    } else {
                      var ishave = false;
                    }
                    that.setData({
                      ishavaData: ishave,
                      ocData: res.data.data
                    })
                    console.log(res.data.data)
                  }
                })
              } catch (e) {
                console.log(e);
              }
            } else if (res.cancel) {
              console.log('保存失败');
            }
          }
        })
      } else {
        console.log('添加的异地物流数目不能大于10条');
        wx.showToast({
          title: '添加的异地物流数目不能大于10条',
          icon: 'none',
          duration: 2000
        })
      }
    }
    //如果信息填写不完整，弹出输入框
    if (flag == true) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: warn
      })
    }
  },

  /*编辑数据库物流信息 */
  editDbOcInfo: function (e) {
    var id = e.currentTarget.dataset.id;
    var ocid = e.currentTarget.dataset.ocid;
    var name = e.currentTarget.dataset.name;
    var yunfei = e.currentTarget.dataset.price;
    var ocSingle = new Array();
    ocSingle[0] = { 'id': ocid }
    ocSingle[1] = { 'name': name }
    ocSingle[2] = { 'yunfei': yunfei}
    ocSingle[3] = { 'checked': false }
    this.setData({
      ocSingle: ocSingle,
      showOcPop: true
    })
    console.log(ocSingle);
  },

  /**
  *保存编辑物流信息事件
  */
  editConfirm: function (e) {
    var that = this;
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    if (that.data.ocSingle[1].name == '') {
      warn = "请填写物流名称";
    } else {
      flag = false;//若必要信息都填写，则不用弹框      
      that.setData({
        nooc: false //不显示底部背景
      })
      var id = e.currentTarget.dataset.id;
      //向服务器端发送修改后的物流信息
      wx.request({
        url: 'http://localhost/jielong/index.php/xcx/Othercity/editothercity/',
        data: {
          openid: app.globalData.openid,
          ocid: id,
          name: that.data.ocSingle[1].name,
          yunfei: that.data.ocSingle[2].yunfei
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data);
          that.setData({
            ocData: res.data.data
          })
        }
      })
      wx.showModal({
        content: '设置成功！是否要将此次编辑的物流信息同步到默认设置中去，以便下次使用。',
        success: function (res) {
          if (res.confirm) {
            console.log('保存成功');
          } else if (res.cancel) {
            console.log('保存失败');
          }
        }
      })
    }
    this.hideOcPop();
    //如果信息填写不完整，弹出输入框
    if (flag == true) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: warn 
      })
    }
  },

  listenerRadioGroup: function (e) {
    this.setData({
      selvalue: e.detail.value
    })
  },

  /*单选框点击事件*/
  selRadio: function () {
    var items = this.data.ocData;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id == this.data.selvalue) {
        for (var j = 0; j < items.length; j++) {
          if (items[j].checked && j != i) {
            items[j].checked = false;
          }
        }
        items[i].checked = !(items[i].checked);
      }
    }
    this.setData({
      ocData: items
    });
    
  },

  /* 选择物流信息后的提交事件 */
  ocSubmit: function (e) {
    var that = this;
    var oc_id = e.detail.value.ocsub;
    console.log(oc_id);
    if (oc_id != '') {
      var subData = app.globalData.subGoodsInfo;
      subData['oc'] = oc_id;
      app.globalData.subGoodsInfo = subData;
      //console.log(typeof(JSON.stringify(app.globalData.subGoodsInfo)));
      try {
        wx.setStorageSync('pubgoods', app.globalData.subGoodsInfo);
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '物流信息设置完成！',
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 0     //返回发布接龙信息页面
              })
            }
          }
        })
      } catch (e) {
        console.log('没有加入缓存');
      }
    } else {
      console.log('没有接收到oc_id');
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
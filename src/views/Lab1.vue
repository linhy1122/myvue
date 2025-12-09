<!-- eslint-disable vue/block-lang -->
<!-- eslint-disable vue/multi-word-component-names -->
<script >
export default {

name: 'Lab1',

  data() {
    return {

      val1: 1,
      val2: 2,
      val3: 3,
      val4: 4,

       opName: '',
                    slBase: '',
                    nmBase: '',
                    slWithPrefix: '',
                    nmWithPrefix: '',
      price: 0,    // 单价
      number: 1,   // 数量
      message: 'Hello Vue!',
      spanTitle: '我是一个span的title',
      imgAlt: '我是一个img',
      //imgSrc: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.kLp_AWXZdVS3rZFvJNgoMAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
      imgSrc: 'https://ts1.tc.mm.bing.net/th/id/R-C.9c61bf63cf1b10c1fe2eabfe3b6dddd1?rik=abmpdHgYisI9eg&riu=http%3a%2f%2fwww.jiongyaya.com%2fuploads%2fallimg%2f121129%2f1-12112Z92206.jpg&ehk=rAHtO3SSRxx7ps5g3dFcYWW%2b1bSy0Hyw6ZpHaCnsBjM%3d&risl=&pid=ImgRaw&r=0',
  // 步骤1：新增data字段msg
      msg: 'success',
      timer: null,
      myMethod() {
        return 'Hello XMUT'
      },

      count: 0,
      //  click(){
      //    this.count+=1;
      //  },

      // msg: 'success',
      radio: '1',
      ischecked: true,
      options: [{
        value: '选项1',
        label: '1'
      }, {
        value: '选项2',
        label: '2'
      }, {
        value: '选项3',
        label: '3'
      }, {
        value: '选项4',
        label: '4'
      }, {
        value: '选项5',
        label: '5'
      }],
      value: '',
      value1: [],

      isShow: true, // 控制第一个 p 标签的显示
      score: 85,// 控制成绩等级的显示
      isVisible: true,

      sites: [
        { name: 'Runoob' },
        { name: 'Google' },
        { name: 'Taobao' }
      ],

      bookAry: [
        {
          id: 1,
          name: "vue",
          price: 100
        },
        {
          id: 2,
          name: "springboot",
          price: 200
        },

      ],

    };

  },
  methods: {
    show() {
      console.log('当前msg的值是：', this.msg)
    },
  }
}
</script>

<template>
<div>
 <input type="text" v-model.trim="msg" />
    <span>input:{{ msg }}</span>

    <br>
    <textarea v-model="msg"></textarea>
    <span>textarea:{{ msg }}</span>

    <br>
    <div class="a-radio">
      <el-radio v-model="radio" label="1">1</el-radio>
      <el-radio v-model="radio" label="2">2</el-radio>
      <span>radio:{{ radio }}</span>
    </div>
    <br>
    <el-checkbox v-model="ischecked">ischecked</el-checkbox>
    <span>checkbox:{{ ischecked }}</span>
    <br>
    <el-select v-model="value" placeholder="请选择">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <span>select:{{ value }}</span>
    <br>

    <el-select v-model="value1" multiple placeholder="请选择">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <span>mult-select:{{ value1 }}</span>
    <br>
    </div>

</template>

<style scoped>
</style>

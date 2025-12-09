<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/block-lang -->
<script >
export default {

name: 'Lab2',
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
 {{ message }}
    <span v-bind:title="spanTitle">我是一个span</span>
    <img v-bind:src="imgSrc" v-bind:alt="imgAlt" width="100" height="100" />
    {{ new Date().getTime() }}
    <br />
    <img src="../assets/logo.png" :title="myMethod()" width="100" height="100" />
    <br />

    <!-- 条件为 true 时渲染，false 时不渲染 -->
    <p v-if="isShow">这是 v-if 控制的内容</p>
    <p v-if="score >= 90">优秀</p>
    <p v-else-if="score >= 60">及格</p>
    <p v-else>不及格</p>


    <br>
    <p v-show="true">这是 v-show 控制的内容</p>

    <br>
    <br>

    <br>
    <div id="aa">
      <ol>
        <li v-for="site in sites" v-bind="site" :key="site.name">
          {{ site.name }}
        </li>
      </ol>
    </div>
    <div v-for="item in bookAry" v-bind="item" :key="item.id">
      {{ item.id }}->{{ item.name }}->{{ item.price }}
    </div>
    </div>

</template>

<style scoped>
</style>

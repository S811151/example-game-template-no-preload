import { $game, $data } from './utils/game'
import React, { Component } from 'react';
import { render } from 'react-dom';
import $ from 'jquery';

//音效(音檔播放一次)
//$game.playSound({ src:'檔名和副檔名', volume:50, speed:1 })
//背景音樂(音檔自動循環播放)，背景音樂預設一次只能播放一個音檔，後寫的會蓋過前一個。
//$game.playBgm({ src: '聲音檔案名稱和副檔名',volume: 音量,speed: 速度})
//範例
//$game.playSound({ src: 'https://download.quranicaudio.com/quran/muhammad_siddeeq_al-minshaawee/002.mp3' })
$game.playSound({ src: 'https://download.quranicaudio.com/quran/muhammad_siddeeq_al-minshaawee/002.mp3', speed: 2 })
//$game.playSound({ src: 'walk.mp3', volume: 0.5, speed: 0.7 })
//停止背景音樂
$game.stopBgm()
//停止所有除了背景音樂外的聲音
$game.stopAllSounds()
//提早結束特定音檔
//$game.stopSound('聲音檔案名稱和副檔名')


export function init() {
  $game.gotoScene('start')
}

export const scenes = [
  {
    name: 'start',
    onEnter() {
      $game.setMessage('遊戲開始\n')
      $game.addOption({
        text: '開始遊戲',
        onClick() {
          $game.gotoScene('scene1')
        },
      })
    },
  },
  {
    name: 'scene1',
    onEnter() {
      $game.setMessage('吃早餐\n')
      $game.addOption({
        text: '火腿蛋餅',
        onClick() {
          $game.gotoScene('scene2')
        },
      })
      $game.addOption({
        text: '玉米蛋餅',
        onClick() {
          $game.gotoScene('scene3')
        },
      })
    },
  },
  {
    name: 'scene2',
    onEnter() {
      $game.setMessage('飲料\n')
      $game.addOption({
        text: '奶茶',
        onClick() {
          $game.gotoScene('scene5')
        },
      })
      $game.addOption({
        text: '豆漿',
        onClick() {
          $game.gotoScene('scene10')
        },
      })
    },
  },
  {
    name: 'scene3',
    onEnter() {
      $game.setMessage('肚子痛\n')
      $game.addOption({
        text: '請假回家',
        onClick() {
          $game.gotoScene('scene4')
        },
      })
    },
  },
  {
    name: 'scene4',
    onEnter() {
      $game.setMessage('遊戲結束\n')
      $game.addOption({
        text: '重新開始',
        onClick() {
          $game.gotoScene('scene1')
        },
      })
    },
  },
  {
    name: 'scene5',
    onEnter() {
      $game.setMessage('吃完有精神考試\n')
      $game.addOption({
        text: '寫完了，結果都對',
        onClick() {
          $game.gotoScene('scene6')
        },
      })
      $game.addOption({
        text: '寫完了，發現都錯 ',
        onClick() {
          $game.gotoScene('scene7')
        },
      })
    },
  },
  {
    name: 'scene6',
    onEnter() {
      $game.setMessage('好棒\n')
      $game.addOption({
        text: '重新開始',
        onClick() {
          $game.gotoScene('scene1')
        },
      })
    },
  },
  {
    name: 'scene7',
    onEnter() {
      $game.setMessage('有氣無力回到家\n')
      $game.addOption({
        text: '家人很生氣',
        onClick() {
          $game.gotoScene('scene8')
        },
      })
      $game.addOption({
        text: '家人鼓勵我，下次會更好',
        onClick() {
          $game.gotoScene('scene9')
        },
      })
    },
  },
  {
    name: 'scene8',
    onEnter() {
      $game.setMessage('因為壓力太大所以逃家\n')
      $game.addOption({
        text: '重新開始',
        onClick() {
          $game.gotoScene('scene1')
        },
      })
    },
  },
  {
    name: 'scene9',
    onEnter() {
      $game.setMessage('因為家人鼓勵，所以奮發向上，考上了好大學\n')
      $game.addOption({
        text: '重新開始',
        onClick() {
          $game.gotoScene('scene1')
        },
      })
    },
  },
  {
    name: 'scene10',
    onEnter() {
      $game.setMessage('吃完了，卻沒精神考試\n')
      $game.addOption({
        text: '看別人的答案',
        onClick() {
          $game.gotoScene('scene11')
        },
      })
      $game.addOption({
        text: '用猜的',
        onClick() {
          $game.gotoScene('scene12')
        },
      })
    },
  },
  {
    name: 'scene11',
    onEnter() {
      $game.setMessage('被老師抓到 記大過\n')
      $game.addOption({
        text: '重新開始',
        onClick() {
          $game.gotoScene('scene1')
        },
      })
    },
  },
  {
    name: 'scene12',
    onEnter() {
      $game.setMessage('猜得都對，還是被老師懷疑看隔壁同學的，記大過\n')
      $game.addOption({
        text: '重新開始',
        onClick() {
          $game.gotoScene('scene1')
        },
      })
    },
  },
]

(() => {
  "use strict";

  const
    CIRCLE_STROKE_SIZE_MAX = 813,
    AUTO_SWITCH_COUNT_MAX = 600,
    COUNT_NUM_PREPARE = 5,
    soundPath = "./assets/sounds/",
    THEME_COLORS = {
        light: {
            textColor : "#333333",
            backgroundColorSetting : "#f1f0f2",
            backgroundColorCount : "#ffffff",
            backgroundColorPickerCard : "#ffffff",
            colorMain : "#f87c54",
            colorInterval : "#4ac08d",
            colorBackgroundCircle : "#e6e6e6",
            statusBarColor : "dark-content"
        },
        dark: {
            textColor : "#dddddd",
            backgroundColorSetting : "#1a2744",
            backgroundColorCount : "#1a2744",
            backgroundColorPickerCard : "#424e69",
            colorMain : "#fa8f6d",
            colorInterval : "#72C19f",
            colorBackgroundCircle : "#424e69",
            statusBarColor : "light"
        },
    },
    PrimaryButton = document.getElementById("PrimaryButton"),
    SecondaryButton = document.getElementById("SecondaryButton"),
    nowPrepareCount = document.getElementById("nowPrepareCount"),
    countTime = document.getElementById("countTime"),
    totalTime = document.getElementById("totalTime"),
    countPitch = document.getElementById("countPitch"),
    pitchSec = document.getElementById("pitchSec");

    let
      pauseFlg = false,
      cancelFlg = false,
      soundErrorNumFlg = false,
      soundErrorTextFlg = false,
      autoCancelCount = 0,
      // colorSchemeName = Appearance.getColorScheme(),
      colorChangeFlg = false,
      commonState = {
        nowStatus: "SETTING",
        settingTime: 1,
        settingSet: 1,
        settingPitch: 1,
        settingIntervalMinutes: 0,
        settingIntervalSeconds: 0,
        // backgroundColor: THEME_COLORS[colorSchemeName].backgroundColorSetting,
        nowPrepareCount: COUNT_NUM_PREPARE,
        primaryButtonLabel: "スタート",
        secondaryButtonLabel: "キャンセル",
        primaryButtonIsDisabled: false,
        secondaryButtonIsDisabled: true,
        nowTimeCount: 0,
        nowPitchSecondCount: 0,
        nowCircleStrokeDasharray: "0 " + " " + String(CIRCLE_STROKE_SIZE_MAX),
        nowSetCount: 1,
        nowIntervalMinutes: 0,
        nowIntervalSeconds: 0,
        // mainKeyColor: THEME_COLORS[colorSchemeName].colorMain,
        isCountEnd: false,
        isReady: false,
        // textColor: THEME_COLORS[colorSchemeName].textColor,
        // backgroundColorSetting: THEME_COLORS[colorSchemeName].backgroundColorSetting,
        // backgroundColorCount: THEME_COLORS[colorSchemeName].backgroundColorCount,
        // backgroundColorPickerCard: THEME_COLORS[colorSchemeName].backgroundColorPickerCard,
        // colorMain: THEME_COLORS[colorSchemeName].colorMain,
        // colorInterval: THEME_COLORS[colorSchemeName].colorInterval,
        // colorBackgroundCircle: THEME_COLORS[colorSchemeName].colorBackgroundCircle,
        // statusBarColor: THEME_COLORS[colorSchemeName].statusBarColor
      };

    /**
     * Function counter
     */
    const _mainCount = () => {
      let time = 0,
          label = "",
          nowTime = 0,
          flg = 0,
          circleSize = 0,
          nowSecond = 0,
          nowPercentage = 0,
          settingTime = commonState["settingTime"],
          settingPitch = commonState["settingPitch"],
          settingSet = commonState["settingSet"],
          maxSeconds = settingTime * settingPitch;
        commonState["nowStatus"] = "COUNTER";
        commonState["nowPitchSecondCount"] =  0;
        countPitch.textContent = commonState["nowPitchSecondCount"];

        commonState["nowCircleStrokeDasharray"] =  String(circleSize) + " " + String(CIRCLE_STROKE_SIZE_MAX);
        commonState["nowTimeCount"] =  nowTime;
      const timerId = setInterval(() => {
          if (cancelFlg === true) {
              clearInterval(timerId);
              circleSize = 0;
              cancelFlg = false;
          } else if (pauseFlg === false) {
              time++;
              flg++;
              if (flg <= settingPitch) {
                  nowSecond++;
                  nowPercentage = Math.floor(nowSecond / maxSeconds * 100);
                  circleSize = Math.floor(CIRCLE_STROKE_SIZE_MAX * nowPercentage / 100);
                  label = time;
                  commonState["nowPitchSecondCount"] = label;
                  pitchSec.textContent = commonState["nowPitchSecondCount"];
                  commonState["nowCircleStrokeDasharray"] = String(circleSize) + " " + String(CIRCLE_STROKE_SIZE_MAX);
                  // this._playSound(true, Number(time));
              }
              if (flg === settingPitch) {
                  nowTime++;
                  commonState["nowTimeCount"] = nowTime;
              }
              if (flg > settingPitch) {
                  if (nowTime >= settingTime) {
                      clearInterval(timerId);
                      if (commonState["nowSetCount"] === settingSet) {
                          label = "終了";
                          // this._playSound(false, "end");
                          commonState["secondaryButtonLabel"] = "設定へ";
                          commonState["primaryButtonIsDisabled"] = true;
                          commonState["nowPitchSecondCount"] = label;
                          commonState["isCountEnd"] = true;
                          commonState["nowCircleStrokeDasharray"] = String(CIRCLE_STROKE_SIZE_MAX) + " " + String(CIRCLE_STROKE_SIZE_MAX);

                          // (async() => {
                          //     await Analytics.logEvent("arrival_finish");
                          // })();
                      } else if (commonState["nowSetCount"] < settingSet) {
                          if (commonState["settingIntervalMinutes"] === 0 && commonState["settingIntervalSeconds"] === 0) {
                              commonState["nowSetCount"] = Number(commonState["nowSetCount"] + 1);
                              // this._judgeTimesSound(nowTime);
                              this._mainCount();
                          } else {
                              // this._countIntervalTime();
                              // this._playSound(false, "rest");
                          }
                      }
                  } else {
                      // this._judgeTimesSound(nowTime);
                  }
                  flg = 0;
                  time = 0;
              }
          } else if (pauseFlg === true) {
              autoCancelCount++;
              if (autoCancelCount > AUTO_SWITCH_COUNT_MAX) {
                  // this.cancelCount();

                  // (async() => {
                  //     await Analytics.logEvent("arrival_forced_termination");
                  // })();
              }
          }
      }, 1000);
  }

  /**
   * Function prepare count
   */
  const _prepareCount = () => {
    commonState["nowStatus"] = "PREPARE";
    // backgroundColor: this.state.backgroundColorCount,
    commonState["primaryButtonLabel"] = "一時停止";
    commonState["secondaryButtonIsDisabled"] = false;
    nowPrepareCount.textContent = COUNT_NUM_PREPARE;

    let
      time = COUNT_NUM_PREPARE,
      label = "";
        // this._playSound(true, COUNT_NUM_PREPARE);
    const timerId = setInterval(() => {
        if (cancelFlg === true) {
            clearInterval(timerId);
            cancelFlg = false;
        } else if (pauseFlg === false) {
            time--;
            switch (time) {
                case 0:
                    label = "スタート";
                    // this._playSound(false, "start");
                    break;
                case -1:
                    clearInterval(timerId);
                    _mainCount();
                    break;
                default:
                    // this._playSound(true, Number(time));
                    label = time;
                    break;
            }
            commonState["nowPrepareCount"] = label;
            nowPrepareCount.textContent = commonState["nowPrepareCount"];
        // } else if (pauseFlg === true) {
        //     autoCancelCount++;
        //     if (autoCancelCount > AUTO_SWITCH_COUNT_MAX) {
                // this.cancelCount();

                // (async() => {
                //     await Analytics.logEvent("arrival_forced_termination");
                // })();
            // }
        }
    }, 1000);
  };

  const handlePrimaryButton = () => {
    // if (this.state.nowStatus === "SETTING") {
      _prepareCount();
    //   let latestSettings = {
    //       settingSet: this.state.settingSet,
    //       settingTime: this.state.settingTime,
    //       settingIntervalMinutes: this.state.settingIntervalMinutes,
    //       settingIntervalSeconds: this.state.settingIntervalSeconds,
    //       settingPitch: this.state.settingPitch
    //   }
    //   this._storeData("@WorkoutVoiceCounterSuperStore:latestSettings", latestSettings).catch(() => {
    //       Bugsnag.notify("Error _storeData");
    //   });
    //   (async() => {
    //       await Analytics.logEvent("click_start");
    //   })();
    // } else {
    //     this._pauseCount();
    // }
  };

  const handleSecondaryButton = () => {
    // this.cancelCount();
    // if (this.state.isCountEnd) {
    //     (async() => {
    //         await Analytics.logEvent("click_home");
    //     })();
    // } else {
    //     (async() => {
    //         await Analytics.logEvent("click_cancel", {
    //             nowStatus: this.state.nowStatus
    //         });
    //     })();
    // }
  };

  const initialize = () => {
    // TODO: 前の設定が読まれていたら設定する
    // if (value !== undefined && value !== null) {
    //   this.setState(
    //     (state, props) => {
    //         return {
    //             settingTime: value.settingTime,
    //             settingSet: value.settingSet,
    //             settingPitch: value.settingPitch,
    //             settingIntervalMinutes: value.settingIntervalMinutes,
    //             settingIntervalSeconds: value.settingIntervalSeconds,
    //         }
    //     },
    //     () => {
    //         this.setState({
    //             isReady: true
    //         }, async () => {
    //             await SplashScreen.hideAsync();
    //         });
    //     }
    //   );
    // } else {
      commonState["isReady"] = true;
      // SplashScreen.hideAsync();
    // }

    PrimaryButton.addEventListener("click", () => {
      console.log("プライマリー");
      handlePrimaryButton();
    });

    SecondaryButton.addEventListener("click", () => {
      console.log("キャンセル");
      handleSecondaryButton();
    });

  };

  // document.addEventListener("load", () => {
  initialize();
  // });

})();
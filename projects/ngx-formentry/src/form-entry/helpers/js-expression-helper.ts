import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { southEastAsiaCvdRiskTables } from './risk-dataset-table';

@Injectable()
export class JsExpressionHelper {
  calcBMI(height, weight) {
    let r;
    if (height && weight) {
      r = (weight / (((height / 100) * height) / 100)).toFixed(1);
    }
    return height && weight ? parseFloat(r) : null;
  }

  calcBSA(height: number, weight: number) {
    let result;
    if (height && weight) {
      result = Math.sqrt((height * weight) / 3600).toFixed(2);
    }
    return height && weight ? parseFloat(result) : null;
  }

  calcBMIForAgeZscore(bmiForAgeRef, height, weight) {
    let bmi;
    const maxAgeInDays = 1856;
    if (height && weight) {
      bmi = (weight / (((height / 100) * height) / 100)).toFixed(1);
    }
    const refSectionObject = _.first(bmiForAgeRef);
    let formattedSDValue;
    if (refSectionObject) {
      const refObjectValues = Object.keys(refSectionObject)
        .map((key) => refSectionObject[key])
        .map((x) => x);
      const refObjectKeys = Object.keys(refSectionObject);
      const minimumValue = refObjectValues[1];
      const minReferencePoint = [];
      if (bmi < minimumValue) {
        minReferencePoint.push(minimumValue);
      } else {
        _.forEach(refObjectValues, (value) => {
          if (value <= bmi) {
            minReferencePoint.push(value);
          }
        });
      }
      const lastReferenceValue = _.last(minReferencePoint);
      const lastValueIndex = _.findIndex(refObjectValues, (o) => {
        return o === lastReferenceValue;
      });
      const SDValue = refObjectKeys[lastValueIndex];
      formattedSDValue = SDValue.replace('SD', '');
      if (formattedSDValue.includes('neg')) {
        formattedSDValue = formattedSDValue.substring(1, 0);
        formattedSDValue = '-' + formattedSDValue;
      }

      if (
        formattedSDValue === 'S' ||
        formattedSDValue === 'L' ||
        formattedSDValue === 'M' ||
        formattedSDValue === '-5'
      ) {
        formattedSDValue = '-4';
      }
    }

    return bmi && refSectionObject ? formattedSDValue : null;
  }
  calcWeightForHeightZscore(weightForHeightRef, height, weight) {
    let refSection;
    let formattedSDValue;
    if (height && weight) {
      height = parseFloat(height).toFixed(1);
    }
    const standardHeightMin = 45;
    const standardMaxHeight = 110;
    if (height < standardHeightMin || height > standardMaxHeight) {
      formattedSDValue = -4;
    } else {
      refSection = _.filter(weightForHeightRef, (refObject) => {
        return parseFloat(refObject['Length']).toFixed(1) === height;
      });
    }

    const refSectionObject = _.first(refSection);
    if (refSectionObject) {
      const refObjectValues = Object.keys(refSectionObject)
        .map((key) => refSectionObject[key])
        .map((x) => x);
      const refObjectKeys = Object.keys(refSectionObject);
      const minimumValue = refObjectValues[1];
      const minReferencePoint = [];
      if (weight < minimumValue) {
        minReferencePoint.push(minimumValue);
      } else {
        _.forEach(refObjectValues, (value) => {
          if (value <= weight) {
            minReferencePoint.push(value);
          }
        });
      }
      const lastReferenceValue = _.last(minReferencePoint);
      const lastValueIndex = _.findIndex(refObjectValues, (o) => {
        return o === lastReferenceValue;
      });
      const SDValue = refObjectKeys[lastValueIndex];
      formattedSDValue = SDValue.replace('SD', '');
      if (formattedSDValue.includes('neg')) {
        formattedSDValue = formattedSDValue.substring(1, 0);
        formattedSDValue = '-' + formattedSDValue;
      }
      if (
        formattedSDValue === 'S' ||
        formattedSDValue === 'L' ||
        formattedSDValue === 'M' ||
        formattedSDValue === '-5'
      ) {
        formattedSDValue = '-4';
      }
    }

    return height && weight ? formattedSDValue : null;
  }

  calcHeightForAgeZscore(heightForAgeRef, height, weight) {
    const refSectionObject = _.first(heightForAgeRef);
    let formattedSDValue;
    if (refSectionObject) {
      const refObjectValues = Object.keys(refSectionObject)
        .map((key) => refSectionObject[key])
        .map((x) => x);
      const refObjectKeys = Object.keys(refSectionObject);
      const minimumValue = refObjectValues[1];
      const minReferencePoint = [];
      if (height < minimumValue) {
        minReferencePoint.push(minimumValue);
      } else {
        _.forEach(refObjectValues, (value) => {
          if (value <= height) {
            minReferencePoint.push(value);
          }
        });
      }
      const lastReferenceValue = _.last(minReferencePoint);
      const lastValueIndex = _.findIndex(refObjectValues, (o) => {
        return o === lastReferenceValue;
      });
      const SDValue = refObjectKeys[lastValueIndex];
      formattedSDValue = SDValue.replace('SD', '');
      if (formattedSDValue.includes('neg')) {
        formattedSDValue = formattedSDValue.substring(1, 0);
        formattedSDValue = '-' + formattedSDValue;
      }

      if (
        formattedSDValue === 'S' ||
        formattedSDValue === 'L' ||
        formattedSDValue === 'M' ||
        formattedSDValue === '-5'
      ) {
        formattedSDValue = '-4';
      }
    }

    return height && weight && refSectionObject ? formattedSDValue : null;
  }

  calcSouthEastAsiaNonLabCVDRisk(
    sex: 'M' | 'F',
    smoker?: boolean,
    age?: number,
    sbp?: number,
    bmi?: number
  ) {
    const hasValidValues =
      typeof sex === 'string' &&
      typeof smoker === 'boolean' &&
      typeof age === 'number' &&
      typeof sbp === 'number' &&
      typeof bmi === 'number';

    if (!hasValidValues) {
      return null;
    }
    // Bin functions
    const getAgeBin = (age) =>
      Math.floor((Math.min(Math.max(40, age), 74) - 40) / 5);
    const getSbpBin = (sbp) =>
      Math.max(0, Math.floor((Math.min(sbp, 180) - 120) / 20) + 1);
    const getBmiBin = (bmi) =>
      Math.max(0, Math.floor((Math.min(bmi, 35) - 20) / 5) + 1);

    // Variables
    const sexIdx = sex === 'M' ? 0 : 1;
    const smokerIdx = smoker ? 1 : 0;
    const ageIdx = 6 - getAgeBin(age);
    const bmiIdx = getBmiBin(bmi);
    const sbpIdx = 4 - getSbpBin(sbp);

    return southEastAsiaCvdRiskTables[sexIdx][smokerIdx][ageIdx][sbpIdx][
      bmiIdx
    ];
  }

  isEmpty(val) {
    if (
      val === undefined ||
      val === null ||
      val === '' ||
      val === 'null' ||
      val === 'undefined'
    ) {
      return true;
    }

    if (Array.isArray(val) && val.length === 0) {
      return true;
    }
    return false;
  }

  arrayContains(array, members) {
    if (Array.isArray(members)) {
      if (members.length === 0) {
        return true;
      }

      let contains = true;

      for (let i = 0; i < members.length; i++) {
        const val = members[i];
        if (array.indexOf(val) === -1) {
          contains = false;
        }
      }

      return contains;
    } else {
      return array.indexOf(members) !== -1;
    }
  }
  extractRepeatingGroupValues(key, array) {
    const values = array.map(function (item) {
      return item[key];
    });
    return values;
  }
  formatDate(value, format, offset) {
    format = format || 'yyyy-MM-dd';
    offset = offset || '+0300';

    if (!(value instanceof Date)) {
      value = new Date(value);
      if (value === null || value === undefined) {
        throw new Error(
          'DateFormatException: value passed ' + 'is not a valid date'
        );
      }
    }

    return value; // TODO implement this
    // return $filter('date')(value, format, offset);
  }

  arrayContainsAny(array, members) {
    if (Array.isArray(members)) {
      if (members.length === 0) {
        return true;
      }
      let contains = false;

      for (let i = 0; i < members.length; i++) {
        const val = members[i];
        if (array.indexOf(val) !== -1) {
          contains = true;
        }
      }
      return contains;
    } else {
      return array.indexOf(members) !== -1;
    }
  }

  /**
   * Takes a target control, an encounter and concept uuid. If the target control has a value it returns it
   * otherwise it tries to find it in the encounter. Finally it returns null of it can't find either of them.
   * @param targetControl
   * @param rawEncounter
   * @param uuid
   * @returns
   */
  getObsFromControlOrEncounter(targetControl, rawEncounter, uuid): any {
    const findObs = (obs, uuid) => {
      let result;
      obs?.some(
        (o) =>
          (result =
            o?.concept?.uuid === uuid ? o : findObs(o.groupMembers || [], uuid))
      );
      return result;
    };
    const obsValue = findObs(rawEncounter?.obs, uuid)?.value;
    return !!targetControl
      ? targetControl
      : typeof obsValue === 'object'
      ? obsValue.uuid
      : !!obsValue
      ? obsValue
      : null;
  }

  doesNotMatchExpression(
    regexString: string,
    val: string | null | undefined
  ): boolean {
    if (!val || ['undefined', 'null', ''].includes(val.toString())) {
      return true;
    }
    const pattern = new RegExp(regexString);
    if (!pattern.test(val)) {
      return true;
    }
    return false;
  }

  calcGravida(parityTerm, parityAbortion) {
    let gravida = 0;

    if (Number.isInteger(parityTerm)) {
      gravida += parityTerm + 1;
    }

    if (Number.isInteger(parityAbortion)) {
      gravida += parityAbortion + 1;
    }

    if (Number.isInteger(parityTerm) && Number.isInteger(parityAbortion)) {
      gravida = parityTerm + parityAbortion + 1;
    }

    return gravida;
  }

  calcSouthAfricanTEWS(
    age,
    heightCm,
    rr,
    hr,
    temp,
    bp,
    avpu,
    mobility,
    trauma
  ) {
    function avpuScore(val) {
      val = (val || '').toUpperCase();
      if (val === '160282AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA') return 0;
      if (val === '162645AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA') return 1; // V-Voice
      if (val === '162644AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA') return 2; // P-Pain
      if (val === '159508AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA') return 3; // U-Unresponsive
      // if (val === "120345AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") return ?; // C-Confused
    }

    function mobilityScore(val) {
      if (!val) return 0;
      val = val.toUpperCase();
      if (val === '162751AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA') return 1; //Assisted
      if (val === '162752AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA') return 2; //Stretcher/immobile
      // if( val === "162750AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") return ?; // Walking
      return 0; // unknown
    }

    function determineCategory(age, heightCm) {
      if (heightCm != null) {
        if (heightCm < 95) return 'YOUNGER_CHILD';
        if (heightCm <= 150) return 'OLDER_CHILD';
        return 'ADULT';
      }
      if (age != null) {
        if (age < 3) return 'YOUNGER_CHILD';
        if (age <= 12) return 'OLDER_CHILD';
        return 'ADULT';
      }
      return 'ADULT';
    }

    let score = 0;
    const category = determineCategory(age, heightCm);

    // YOUNGER CHILD (<3 years or <95cm)
    if (category === 'YOUNGER_CHILD') {
      // RR
      if (rr < 20) score += 3;
      else if (rr <= 25) score += 2;
      else if (rr <= 39) score += 1;
      else if (rr <= 49) score += 2;
      else score += 3;

      // HR
      if (hr < 70) score += 3;
      else if (hr <= 79) score += 2;
      else if (hr <= 130) score += 0;
      else if (hr <= 159) score += 2;
      else score += 3;

      // Temp
      if (temp < 35) score += 3;
      else if (temp <= 38.4) score += 0;
      else score += 2;

      score += avpuScore(avpu);
      score += mobilityScore(mobility);

      if (trauma === '1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA') score += 1;
    }

    //OLDER CHILD (3–12 years or 95–150cm)
    else if (category === 'OLDER_CHILD') {
      if (rr < 15) score += 3;
      else if (rr <= 16) score += 2;
      else if (rr <= 21) score += 1;
      else if (rr <= 26) score += 1;
      else score += 3;

      if (hr < 60) score += 3;
      else if (hr <= 79) score += 2;
      else if (hr <= 99) score += 1;
      else if (hr <= 129) score += 1;
      else score += 3;

      if (temp < 35) score += 3;
      else if (temp <= 38.4) score += 0;
      else score += 2;

      score += avpuScore(avpu);
      score += mobilityScore(mobility);

      if (trauma === '1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA') score += 1;
    }

    // ADULT (>12 years or >150cm)
    else {
      // RR
      if (rr < 9) score += 3;
      else if (rr <= 14) score += 1;
      else if (rr <= 20) score += 0;
      else if (rr <= 29) score += 1;
      else score += 3;

      // HR
      if (hr < 40) score += 3;
      else if (hr <= 50) score += 1;
      else if (hr <= 100) score += 0;
      else if (hr <= 120) score += 1;
      else score += 3;

      // Temp
      if (temp < 35) score += 3;
      else if (temp <= 37) score += 0;
      else if (temp <= 38.5) score += 1;
      else score += 2;

      // BP (adult only)
      if (bp < 70) score += 3;
      else if (bp <= 80) score += 2;
      else if (bp <= 100) score += 1;
      else if (bp <= 199) score += 0;
      else score += 2;

      score += avpuScore(avpu);
      score += mobilityScore(mobility);
    }

    // Priority
    let priority;
    if (score >= 7) priority = '1882AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    //Emergency
    else if (score >= 5) priority = '159409AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    //Very Urgent
    else if (score >= 3) priority = '1883AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    //Urgent
    else priority = '1115AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'; //Routine

    return { score, priority, category };
  }

  get helperFunctions() {
    const helper = this;
    return {
      arrayContainsAny: helper.arrayContainsAny,
      calcBMI: helper.calcBMI,
      calcBMIForAgeZscore: helper.calcBMIForAgeZscore,
      calcWeightForHeightZscore: helper.calcWeightForHeightZscore,
      calcHeightForAgeZscore: helper.calcHeightForAgeZscore,
      calcSouthEastAsiaNonLabCVDRisk: helper.calcSouthEastAsiaNonLabCVDRisk,
      isEmpty: helper.isEmpty,
      arrayContains: helper.arrayContains,
      extractRepeatingGroupValues: helper.extractRepeatingGroupValues,
      getObsFromControlOrEncounter: helper.getObsFromControlOrEncounter,
      doesNotMatchExpression: helper.doesNotMatchExpression,
      calcGravida: helper.calcGravida,
      calcSouthAfricanTEWS: helper.calcSouthAfricanTEWS
    };
  }
}

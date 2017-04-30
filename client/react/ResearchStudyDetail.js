import { Card, CardActions, CardMedia, CardText, CardTitle } from 'react-toolbox/lib/card';
import { Col, Row } from 'react-bootstrap';
import {Tab, Tabs} from 'react-toolbox/lib/tabs';
import { insertResearchStudy, removeResearchStudyById, updateResearchStudy } from '../../../api/researchStudys/methods';

import { AddDocument } from '../../components/AddDocument.js';
import { Bert } from 'meteor/themeteorchef:bert';
import Button from 'react-toolbox/lib/button';
import DatePicker from 'react-toolbox/lib/date_picker';
import DocumentsList from '../../containers/documents-list.js';
import { GlassCard } from '/imports/ui/components/GlassCard';
import Input from 'react-toolbox/lib/input';
import { PageContainer } from '../../components/PageContainer';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import ResearchStudyTable from '../../workflows/researchStudys/ResearchStudyTable';

//import { DatePicker, DatePickerDialog, Calendar, CalendarDay, CalendarMonth } from 'react-toolbox/lib/date_picker';

let defaultState = false;

Session.setDefault('researchStudyDetailState', defaultState);


export default class ResearchStudyDetail extends React.Component {
  getMeteorData() {
    let data = {
      researchStudyId: false,
      researchStudy: {
        id: "",
        name: "",
        gender: "",
        active: true,
        birthdate: new Date(),
        photo: ""
      }
    }

    if (Session.get('selectedResearchStudy')) {
      data.researchStudyId = Session.get('selectedResearchStudy');

      let selectedResearchStudy = ResearchStudies.findOne({_id: Session.get('selectedResearchStudy')});
      if (selectedResearchStudy) {
        data.researchStudy = {
          id: selectedResearchStudy._id,
          birthdate: new Date(moment(selectedResearchStudy.birthdate)),
          gender: selectedResearchStudy.gender,
          active: selectedResearchStudy.active.toString(),
          photo: selectedResearchStudy.photo ? selectedResearchStudy.photo[0].url : "",
          name: selectedResearchStudy.name ? selectedResearchStudy.name[0].text : ""
        }
      }
    }

    if (Session.get('researchStudyDetailState')) {
      data.researchStudy = Session.get('researchStudyDetailState');
    }

    //console.log("data", data);

    return data;
  };

  render() {
    return (
      <div className="researchStudyDetail">
        <CardText>
          <Input ref="name" type='text' label='name' name='name' value={this.data.researchStudy.name} onChange={ this.changeState.bind(this, 'name')} />
          <Input ref="active" type='text' label='active' name='active' value={this.data.researchStudy.active} onChange={ this.changeState.bind(this, 'active')} />
          <Input ref="gender" type='text' label='gender' name='gender' value={this.data.researchStudy.gender} onChange={ this.changeState.bind(this, 'gender')} />
          <Input ref="photo" type='text' label='photo' name='photo' value={this.data.researchStudy.photo} onChange={ this.changeState.bind(this, 'photo')} />
          <DatePicker ref="birthdate" label='birthdate' name='birthdate' value={this.data.researchStudy.birthdate} onChange={ this.changeState.bind(this, 'birthdate')}  />
        </CardText>
        <CardActions>
          { this.determineButtons(this.data.researchStudyId) }
        </CardActions>
      </div>
    );
  }
  determineButtons(researchStudyId){
    if (researchStudyId) {
      return (
        <div>
          <Button label="Save" onClick={this.handleSaveButton.bind(this)} />
          <Button label="Delete" onClick={this.handleDeleteButton.bind(this)} />
        </div>
      );
    } else {
      return(
        <Button label="Save" onClick={this.handleSaveButton.bind(this)} />
      );
    }
  };
  // this could be a mixin
  changeState(field, value){

    //console.log("changeState", value);

    // by default, assume there's no other data and we're creating a new researchStudy
    let researchStudyUpdate = {
      id: "",
      birthdate: new Date(),
      gender: "",
      active: true,
      name: "",
      photo: ""
    }

    // if there's an existing researchStudy, use them
    if (Session.get('selectedResearchStudy')) {
      researchStudyUpdate = this.data.researchStudy;
    }

    if (typeof Session.get('researchStudyDetailState') === "object") {
      researchStudyUpdate = Session.get('researchStudyDetailState');
    }
    // if (field === "birthdate") {
    //   researchStudyUpdate[field] = new Date(value);
    // } else {
    //   researchStudyUpdate[field] = value;
    // }
    researchStudyUpdate[field] = value;

    console.log("researchStudyUpdate", researchStudyUpdate);

    Session.set('researchStudyDetailState', researchStudyUpdate);
  };
  openTab(index){
    // set which tab is selected
    let state = Session.get('researchStudyCardState');
    state["index"] = index;
    Session.set('researchStudyCardState', state);
  };

  // this could be a mixin
  handleSaveButton(){
    console.log("this", this);

      let researchStudyFormData = {
        'name': [{
          'text': this.refs.name.refs.input.value
        }],
        'birthdate': this.refs.birthdate.props.value,
        'gender': this.refs.gender.refs.input.value,
        'photo': [{
          url: this.refs.photo.refs.input.value
        }]
      }

      if (this.refs.active.refs.input.value === "true") {
        researchStudyFormData.active = true;
      } else {
        researchStudyFormData.active = false;
      }

      console.log("researchStudyFormData", researchStudyFormData);


    if (Session.get('selectedResearchStudy')) {
      console.log("update practioner");
      //Meteor.users.insert(researchStudyFormData);
      updateResearchStudy.call(
        {_id: Session.get('selectedResearchStudy'), update: researchStudyFormData }, (error) => {
        if (error) {
          console.log("error", error);
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('ResearchStudy updated!', 'success');
          this.openTab(1);
        }
      });
    } else {

      console.log("create a new researchStudy", researchStudyFormData);

      //Meteor.users.insert(researchStudyFormData);
      insertResearchStudy.call(researchStudyFormData, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('ResearchStudy added!', 'success');
          this.openTab(1);
        }
      });
    }
  };

  // this could be a mixin
  handleCancelButton(){
    console.log("handleCancelButton");
  };
  handleDeleteButton(){
    removeResearchStudyById.call(
      {_id: Session.get('selectedResearchStudy')}, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('ResearchStudy deleted!', 'success');
        this.openTab(1);
      }
    });
  };

}


ResearchStudyDetail.propTypes = {
  hasUser: React.PropTypes.object,
};
ReactMixin(ResearchStudyDetail.prototype, ReactMeteorData);

import { CardText, CardTitle } from 'react-toolbox/lib/card';
import {Tab, Tabs} from 'react-toolbox/lib/tabs';

import { GlassCard } from '../components/GlassCard';
import { PageContainer } from '../components/PageContainer';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import ResearchStudyDetail from '../workflows/researchStudys/ResearchStudyDetail';
import ResearchStudyTable from '../workflows/researchStudys/ResearchStudyTable';

let defaultState = {
  index: 1,
  id: "",
  username: "",
  email: "",
  given: "",
  family: "",
  gender: ""
};
Session.setDefault('researchStudyCardState', defaultState);

export class ResearchStudiesPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity')
      },
      state: defaultState
    };

    if (Session.get('researchStudyCardState')) {
      data.state = Session.get('researchStudyCardState');
    }

    // this should all be handled by props
    // or a mixin!
    if (Session.get('darkroomEnabled')) {
      data.style.color = "black";
      data.style.background = "white";
    } else {
      data.style.color = "white";
      data.style.background = "black";
    }

    // this could be another mixin
    if (Session.get('glassBlurEnabled')) {
      data.style.filter = "blur(3px)";
      data.style.webkitFilter = "blur(3px)";
    }

    // this could be another mixin
    if (Session.get('backgroundBlurEnabled')) {
      data.style.backdropFilter = "blur(5px)";
    }

    return data;
  }

  // this could be a mixin
  handleTabChange(index){
    let state = Session.get('researchStudyCardState');
    state["index"] = index;
    Session.set('researchStudyCardState', state);
  }

  // this could be a mixin
  changeState(field, value){
    let state = Session.get('researchStudyCardState');
    console.log("this", this);
    console.log("value", value);

    state[field] = value;
    Session.set('researchStudyCardState', state);
  }

  // this could be a mixin
  onNewTab(){
    console.log("onNewTab");

    Session.set('selectedResearchStudy', false);
    Session.set('researchStudyDetailState', false);
  }

  render() {
    return (
      <div id="documentsPage">
        <PageContainer>
          <GlassCard>
            <CardTitle
              title="ResearchStudys"
            />
            <CardText>

            <Tabs default index={this.data.state.index} onChange={this.handleTabChange}>
             <Tab className="newResearchStudyTab" label='New' style={{padded: "20px"}} onActive={ this.onNewTab } >
               <ResearchStudyDetail />
             </Tab>
             <Tab label='ResearchStudys' onActive={this.handleActive}>
               <ResearchStudyTable />
             </Tab>
             <Tab label='Detail' onActive={this.handleActive} style={{padded: "20px"}} >
               <ResearchStudyDetail />
             </Tab>
           </Tabs>
            </CardText>
          </GlassCard>
        </PageContainer>
      </div>
    );
  }
}


ResearchStudiesPage.propTypes = {
  hasUser: React.PropTypes.object
};
ReactMixin(ResearchStudiesPage.prototype, ReactMeteorData);

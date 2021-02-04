import React, {useEffect} from "react";
import {Grid} from "@material-ui/core";
import {ConceptForm, AddConceptToDictionaryIcon} from "../components";
import {AppState} from "../../../redux";
import {retrieveConceptAction, viewConceptErrorsSelector, viewConceptLoadingSelector} from "../redux";
import {APIConcept, apiConceptToConcept, APIMapping} from "../types";
import {useLocation, useParams} from "react-router";
import {connect} from "react-redux";
import Header from "../../../components/Header";
import {startCase, toLower} from "lodash";
import {APIOrg, APIProfile, canModifyContainer, profileSelector} from "../../authentication";
import {orgsSelector} from "../../authentication/redux/reducer";
import {CONTEXT, ProgressOverlay, useQueryParams} from "../../../utils";
import {EditButton} from "../../containers/components/EditButton";
import {EDIT_BUTTON_TITLE} from "../redux/constants";
import {recursivelyAddConceptsToDictionaryAction} from "../../dictionaries/redux";
interface Props {
  loading: boolean;
  concept?: APIConcept;
  mappings: APIMapping[];
  errors?: {};
  retrieveConcept: (...args: Parameters<typeof retrieveConceptAction>) => void;
  profile?: APIProfile;
  usersOrgs?: APIOrg[];
  addConceptsToDictionary?: (
    ...args: Parameters<typeof recursivelyAddConceptsToDictionaryAction>
  ) => void;
}

const ViewConceptPage: React.FC<Props> = ({
  retrieveConcept,
  concept,
  mappings,
  loading,
  errors,
  profile,
  usersOrgs,
  addConceptsToDictionary
}) => {
  const { pathname: url } = useLocation();
  const { ownerType, owner } = useParams<{
    ownerType: string;
    owner: string;
  }>();
  var { linkedDictionary ,dictionaryToAddTo ,canAddConcept} = useQueryParams();
  if(canAddConcept){
    canAddConcept=atob(canAddConcept);
  }
  const conceptSource = concept?.source_url;

  // we can modify the concept and it lives in our dictionary's linked source
  const showEditButton =
    canModifyContainer(ownerType, owner, profile, usersOrgs) &&
    conceptSource &&
    concept?.url.includes(conceptSource);

  useEffect(() => {
    retrieveConcept(url);
  }, [url, retrieveConcept]);

  return (
    <>
    <Header
      allowImplicitNavigation
      title={concept ? concept.display_name : "View concept"}
    >
      <ProgressOverlay
        delayRender
        loading={loading}
        error={
          errors
            ? "Could not retrieve concept. Refresh this page to retry."
            : undefined
        }
      >
        <Grid id="viewConceptPage" item xs={8} component="div">
          <ConceptForm
            context={CONTEXT.view}
            savedValues={apiConceptToConcept(concept, mappings)}
            errors={errors}
          />
        </Grid>
        {!showEditButton ? null : (
            <EditButton url={`${url}edit/?linkedDictionary=${linkedDictionary}`} title={EDIT_BUTTON_TITLE}/>
        )}
      </ProgressOverlay>
    </Header>
    <AddConceptToDictionaryIcon
      dictionaryToAddTo={dictionaryToAddTo}
      canAddConcept={canAddConcept}
      concept={concept}
      addConceptsToDictionary={(concepts: APIConcept[]) =>
        dictionaryToAddTo &&
        addConceptsToDictionary?addConceptsToDictionary(
          linkedDictionary,
          dictionaryToAddTo,
          concepts
        ):null
      }
    />
   </>
  );
};

const mapStateToProps = (state: AppState) => ({
  profile: profileSelector(state),
  usersOrgs: orgsSelector(state),
  concept: state.concepts.concept,
  mappings: state.concepts.mappings,
  loading: viewConceptLoadingSelector(state),
  errors: viewConceptErrorsSelector(state)
});

const mapActionsToProps = {
  retrieveConcept: retrieveConceptAction,
  addConceptsToDictionary: recursivelyAddConceptsToDictionaryAction
};

export default connect(mapStateToProps, mapActionsToProps)(ViewConceptPage);

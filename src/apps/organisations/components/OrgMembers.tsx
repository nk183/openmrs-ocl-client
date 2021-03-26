import React from "react";
import {
  addOrgMemberAction,
  deleteOrgMemberAction,
  hideAddMemberDialogAction,
  hideDeleteMemberDialogAction,
  resetAddOrgMemberAction,
  resetDeleteOrgMemberAction,
  showAddMemberDialogAction,
  showDeleteMemberDialogAction
} from "../redux";
import {
  Button,
  ButtonGroup,
  createStyles,
  Grid,
  List,
  makeStyles,
  Paper,
  Typography,
  Dialog,
  IconButton,
  ListItem
} from "@material-ui/core";
import { OrgMember } from "../types";
import AddMemberForm from "./AddMemberForm";
import { DeleteOutline as DeleteIcon } from "@material-ui/icons";
import DeleteMemberDialog from "./DeleteMemberDialog";
import { AppState, errorSelector } from "../../../redux";
import { connect } from "react-redux";
import {
  CREATE_ORG_MEMBER_ACTION,
  DELETE_ORG_MEMBER_ACTION
} from "../redux/actionTypes";
import { getPrettyError } from "../../../utils";

interface Props {
  members?: OrgMember[];
  canModifyMembers: boolean;
  addError?: string;
  addMember: (...args: Parameters<typeof addOrgMemberAction>) => void;
  resetAddMember: (...args: Parameters<typeof resetAddOrgMemberAction>) => void;
  showAddMemberDialog: boolean;
  displayAddMemberDialog: () => void;
  hideAddMemberDialog: () => void;
  orgName: string;
  orgUrl: string;
  deleteMember: (...args: Parameters<typeof deleteOrgMemberAction>) => void;
  resetDeleteMember: (
    ...args: Parameters<typeof resetDeleteOrgMemberAction>
  ) => void;
  deleteError?: string;
  showDeleteMemberDialog: boolean;
  displayDeleteMemberDialog: () => void;
  hideDeleteMemberDialog: () => void;
}

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between"
    }
  })
);

const OrganisationMembers: React.FC<Props> = ({
  canModifyMembers,
  members,
  orgName,
  orgUrl,
  addMember,
  addError,
  showAddMemberDialog,
  displayAddMemberDialog,
  hideAddMemberDialog,
  deleteMember,
  deleteError,
  showDeleteMemberDialog,
  displayDeleteMemberDialog,
  hideDeleteMemberDialog
}) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} component="div">
      <Paper className="fieldsetParent">
        <fieldset>
          <Typography component="legend" variant="h5" gutterBottom>
            Members
          </Typography>
          <List>
            {members?.length ? (
              members.map(m => (
                <ListItem className={classes.root} key={m.username}>
                  {m.username || m.name}
                  {!canModifyMembers ? null : (
                    <>
                      <IconButton onClick={displayDeleteMemberDialog}>
                        <DeleteIcon />
                      </IconButton>
                      <DeleteMemberDialog
                        open={showDeleteMemberDialog}
                        handleClose={hideDeleteMemberDialog}
                        handleSubmit={() => deleteMember(orgUrl, m.username)}
                        user={m.name ?? m.username}
                        orgName={orgName}
                        error={deleteError}
                      />
                    </>
                  )}
                </ListItem>
              ))
            ) : (
              <li>No members found!</li>
            )}
          </List>
          {!canModifyMembers ? null : (
            <>
              <ButtonGroup fullWidth variant="text" color="primary">
                <Button onClick={displayAddMemberDialog}>Add New Member</Button>
              </ButtonGroup>
              <Dialog onClose={hideAddMemberDialog} open={showAddMemberDialog}>
                <AddMemberForm
                  orgUrl={orgUrl}
                  handleClose={hideAddMemberDialog}
                  onSubmit={(values: OrgMember) => addMember(orgUrl, values)}
                  error={addError}
                />
              </Dialog>
            </>
          )}
        </fieldset>
      </Paper>
    </Grid>
  );
};

const mapStateToProps = (state: AppState) => ({
  showAddMemberDialog: state.organisations.showAddMemberDialog,
  showDeleteMemberDialog: state.organisations.showDeleteMemberDialog,
  addError: getPrettyError(errorSelector(CREATE_ORG_MEMBER_ACTION)(state)),
  deleteError: getPrettyError(errorSelector(DELETE_ORG_MEMBER_ACTION)(state))
});

const mapActionsToProps = {
  addMember: addOrgMemberAction,
  resetAddMember: resetAddOrgMemberAction,
  displayAddMemberDialog: showAddMemberDialogAction,
  hideAddMemberDialog: hideAddMemberDialogAction,
  deleteMember: deleteOrgMemberAction,
  resetDeleteMember: resetDeleteOrgMemberAction,
  displayDeleteMemberDialog: showDeleteMemberDialogAction,
  hideDeleteMemberDialog: hideDeleteMemberDialogAction
};

export default connect(mapStateToProps, mapActionsToProps)(OrganisationMembers);

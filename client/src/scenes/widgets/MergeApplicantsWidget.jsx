import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import GroupIcon from "@mui/icons-material/Group";
import { useTheme } from "@mui/material/styles";
import FlexBetween from "components/FlexBetween";
import Divider from '@mui/material/Divider';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const MergeApplicantsWidget = ({ PostId }) => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const token = useSelector((state) => state.token);

  const getApplicants = async () => {
    try {
      // console.log(PostId);
      const res = await fetch(
        `http://localhost:3001/mergePosts/${PostId}/applicants`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
        );
      const data = await res.json();
      const updatedUsers = data.map((applicant) => applicant.user);
      setUsers(updatedUsers);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getApplicants();
  }, []);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleUserClick = (userId) => {
    navigate(`/mergeProfilePage/${userId}`);
    navigate(0);
  };

  return (
    <FlexBetween gap="1rem" alignItems="flex-start">
      <FlexBetween gap="0.5rem">
        <Chip icon={<GroupIcon />} color="primary" label="Applicants" />
        <Button onClick={handleClickOpen} disabled={users.length === 0}>
        <AvatarGroup max={3}>
            {users &&
            users.map((user) => (
                <Avatar
                key={user._id}
                src={`http://localhost:3001/assets/${user.picturePath}`}
                />
            ))}
        </AvatarGroup>
        </Button>
        <Dialog open={isDialogOpen} onClose={handleClose} maxWidth="md">
        <DialogTitle>Applicants</DialogTitle>
        <DialogContent dividers style={{ minWidth: '600px', minHeight: '400px' }}>
        <div style={{ maxHeight: '400px', overflow: 'auto' , paddingRight: '20px' }}>
        {users.map((user, index) => (
            <Button
                key={user._id}
                onClick={() => handleUserClick(user._id)}
                style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '0.6rem',
                cursor: 'pointer', // Add cursor style for indicating clickability
                padding: '1.2rem',
                border: '1px solid #e0e0e0',
                borderRadius: '20px',
                width: '100%',
                textAlign: 'left',
                justifyContent: 'flex-start',
                }}
            >
                <Avatar
                src={`http://localhost:3001/assets/${user.picturePath}`}
                style={{ marginRight: '0.5rem' }}
                />
                <div>
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem'}}>
                    {user.name} {user.surname}
                </div>
                <div style={{ color: '#666'}}>{user.email}</div>
                </div>
            </Button>
            ))}
        </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="primary">Close</Button>
        </DialogActions>
        </Dialog>
      </FlexBetween>
    </FlexBetween>
  );
};

export default MergeApplicantsWidget;
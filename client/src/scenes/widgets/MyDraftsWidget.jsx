import {
    Avatar,
    Box,
    Typography,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from "@mui/material";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import WidgetWrapper from "../../components/WidgetWrapper";
import {useEffect, useState} from "react";
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import FlexBetween from "components/FlexBetween";

const MyDraftsWidget = () => {
    const {userId} = useParams();
    const {palette} = useTheme();
    const loggedInUser = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [drafts, setDrafts] = useState([]);
    const [selectedDraftId, setSelectedDraftId] = useState(null);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

    useEffect(() => {
        const fetchDrafts = async () => {
            try {
                const response = await fetch(`http://localhost:3001/mergeDraftData/${userId}`, {
                    method: "GET",
                });
                const draftData = await response.json();
                console.log("draftData");
                console.log(draftData);
                setDrafts(draftData);
            } catch (error) {
                console.log(error);
            }
        };

        fetchDrafts();
    }, [userId]);

    const handleDraftClick = (draftId) => {
        // Save the selected draft data to local storage
        const selectedDraft = drafts.find((draft) => draft._id === draftId);
        if (selectedDraft) {
            console.log("selected Draft in MyDraftsWidget", selectedDraft);
            localStorage.setItem("submissionFormData", JSON.stringify(selectedDraft));
            localStorage.setItem("availableDraftId", draftId);
        }

        navigate(`/submission/${userId}`);
    };

    const handleDeleteDraft = async () => {
        try {
            const response = await fetch(`http://localhost:3001/mergeDraftData/${selectedDraftId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                // Remove the deleted draft from the drafts list
                setDrafts((prevDrafts) => prevDrafts.filter((draft) => draft._id !== selectedDraftId));
            }
            setConfirmationDialogOpen(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleConfirmationDialogOpen = (draftId) => {
        setSelectedDraftId(draftId);
        setConfirmationDialogOpen(true);
    };

    const handleConfirmationDialogClose = () => {
        setConfirmationDialogOpen(false);
    };

    const isNonMobileScreens = true;
    let myProfile = false;
    if (loggedInUser._id === userId) {
        myProfile = true;
    }

    if (!userId) return null;

    return (
        <WidgetWrapper>
            <Box p={2} color={palette.text.primary} maxHeight="750px">
                <Box>
                    <Box display="flex" alignItems="center" gap="1rem">
                        <Typography style={{ fontSize: "24px" }} variant="h6">
                            My Drafts
                        </Typography>
                    </Box>
                    <Box my={2}>
                        <DialogContent dividers style={{ minWidth: '600px', minHeight: drafts.length > 0 ? '1px' : '50px' }}>
                            <div style={{ maxHeight: '400px', overflow: 'auto' , paddingRight: '20px' }}>
                                {drafts.length > 0 ? (
                                    drafts.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((draft) => (
                                        <Box
                                            key={draft._id}
                                            mb={1}
                                            sx={{
                                                border: `1px solid ${palette.divider}`,
                                                borderRadius: "10px",
                                                p: "0.5rem",
                                                "&:hover": {
                                                    cursor: "pointer",
                                                    borderColor: palette.primary.main,
                                                },
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                            onClick={() => handleDraftClick(draft._id)}
                                        >
                                            <Typography variant="subtitle1">{draft.title}</Typography>                                    
                                        <FlexBetween gap="1rem" alignItems="center">
                                            <Typography variant="subtitle1">{formatDistanceToNow(new Date(draft.createdAt), { addSuffix: true })}</Typography>
                                            <Button
                                                variant="text"
                                                color="error"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleConfirmationDialogOpen(draft._id);
                                                }}
                                            >
                                                X
                                            </Button>
                                        </FlexBetween>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography variant="h6" style={{ marginBottom: '0.1rem', textAlign: 'center'}}>
                                        You have no drafts
                                    </Typography>
                                )}
                            </div>
                        </DialogContent>
                    </Box>
                </Box>
            </Box>
            <Dialog open={confirmationDialogOpen} onClose={handleConfirmationDialogClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Are you sure you want to delete this draft?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmationDialogClose}>No</Button>
                    <Button onClick={handleDeleteDraft} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </WidgetWrapper>
    );
};

export default MyDraftsWidget;

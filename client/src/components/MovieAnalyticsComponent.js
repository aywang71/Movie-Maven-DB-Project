import { Button, Card, Modal, Typography, Table, TableBody, TableCell, TableRow, CircularProgress, Divider } from '@mui/material';
import { useState, useEffect } from 'react';
import { formatMoney } from '../utils';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  p: 4,
};

const states = {
  LOADING: 0,
  DONE: 1,
  ERROR: -1
}

const MovieAnalyticsComponent = ({ open, setOpen, uri }) => {
  const [data, setData] = useState({});
  const [status, setStatus] = useState(states.LOADING);

  const loadInsights = () => {
    setStatus(states.LOADING);
    console.log(uri)
    fetch(uri)
      .then(resp => resp.json())
      .then(resp => {
        setData(resp[0]);
        setStatus(states.DONE);
      })
      .catch(err => {
        console.error(err);
        setStatus(states.ERROR);
      });
  };

  useEffect(() => {
    // if (!open) {
    //   return;
    // }
    loadInsights();
  }, [uri]);

  const infoList = [
    { prop: 'Number of Movies', value: data?.num_movies },
    { prop: 'Vote Average', value: data?.vote_average && data?.vote_average.toFixed(2) },
    { prop: 'Vote Count', value: data?.vote_count },
    { prop: 'Average Revenue', value: data?.avg_revenue && formatMoney(data?.avg_revenue) },
    { prop: 'Average Budget', value: data?.avg_budget && formatMoney(data?.avg_budget) },
    { prop: 'Average Runtime', value: data?.avg_runtime && (data?.avg_runtime + " min") },
    { prop: 'Average Popularity', value: data?.avg_popularity && data?.avg_popularity.toFixed(2) }
  ];

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      keepMounted
    >
      <Card sx={style}>
        <Typography id="modal-modal-title" variant="h4">
          Insights
        </Typography>
        <div style={{ marginBottom: 10 }} />
        <Divider />
        <div style={{ marginBottom: 10 }} />
        {
          status === states.LOADING ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
              <CircularProgress />
            </div>
          ) : status === states.ERROR ? (
            <>
              <Typography variant='body2'>An error occurred in loading your insights! Please try again later.</Typography>
              <Button sx={{ marginTop: 2 }} size='small' variant='contained' onClick={loadInsights}>Refresh</Button>
            </>
          ) : (
            <Table size='small' >
              <TableBody >
                {infoList.map(({ prop, value }) =>
                  !!value && (
                    <TableRow key={prop} >
                      <TableCell sx={{ paddingLeft: 0, paddingRight: 0, borderBottom: 'none' }}>
                        <Typography variant='body1' fontWeight='bold' fontStyle='normal' lineHeight={1} mb={1}>
                          {prop}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: 'none' }} align='right'>
                        <Typography variant='body1' fontStyle='normal' lineHeight={1}>
                          {value}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          )
        }
      </Card>
    </Modal>
  );
};

export default MovieAnalyticsComponent;
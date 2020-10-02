DROP TABLE IF EXISTS assesment;
CREATE TABLE assesment (
    assesment_pkey INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    _id UUID NOT NULL,
    metric_id int REFERENCES metrics (metric_id) ON DELETE CASCADE,
    metric_value int NOT NULL,
    user_id int REFERENCES users (user_id) ON DELETE CASCADE,
    meeting_id int REFERENCES meetings (meeting_id) ON DELETE CASCADEs
);
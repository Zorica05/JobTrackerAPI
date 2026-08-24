def test_create_job_data():
    job = {
        "company": "Microsoft",
        "position": "Backend Developer",
        "status": "applied",
    }

    assert job["company"] == "Microsoft"
    assert job["position"] == "Backend Developer"
    assert job["status"] == "applied"


def test_update_job_status():
    job = {
        "company": "Microsoft",
        "position": "Backend Developer",
        "status": "applied",
    }

    job["status"] = "interview"

    assert job["status"] == "interview"

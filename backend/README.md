# What's in My Fridge — FastAPI Backend Setup


##  Prerequisites

* Python 3.10+ 
* pip 
* A Gemini API key

---

## Create Virtual Environment

Navigate to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python3 -m venv .venv
```

Activate it:

### macOS / Linux

```bash
source .venv/bin/activate
```

### Windows

```bash
.venv\Scripts\activate
```

---

## 2. Install Dependencies
```
pip install -r requirements.txt
```

---

## 3. Set Up Environment Variables

Create a `.env` file in the `backend/` directory:

```
GEMINI_API_KEY=your_api_key_here
```

---

## 4. Run the FastAPI Server

Start the server using:

```bash
uvicorn app.main:app --reload
```


##  5. Access the API

* API root:

  ```
  http://127.0.0.1:8000/
  ```

* Interactive docs (Swagger UI):

  ```
  http://127.0.0.1:8000/docs
  ```

Endpoints can be tested using the Interactive docs

---



<aside>
📢

**안내드립니다.**

**스쿨 진행 기간 동안에는 서버가 정상적으로 운영**됩니다.

다만, 과정 종료 이후에는 서버가 종료될 수 있으며, 이 경우 사전에 공지드릴 예정입니다.
따라서 서버 종료 이후에도 해당 API의 데이터가 필요하신 분들께서는 미리 더미 데이터를 생성하여, 서버 종료 시에도 불편이 없도록 대비해 주시기 바랍니다

</aside>

## 📌 자주 묻는 질문 (FAQ)

### 1. 로그인 화면으로 넘어가지 않는 경우

- **현상**: 로그인 화면 진입 불가
- **해결 방법**:
  1. 브라우저 `개발자도구 (F12)` → **Application 탭** → **Local Storage**
  2. 저장된 토큰 삭제 후 다시 시도

### 2. 게시글 페이지 처리 방법

- **기능 설명**: `limit`, `skip` 쿼리 파라미터를 사용해 원하는 만큼 게시글을 가져올 수 있습니다.
- **형식**:
  ```jsx
  "~url?limit=Number&skip=Number";
  ```
- **예시**:
  - `/post/feed/?limit=5&skip=10`
    → 11번째 게시글부터 5개 불러오기

# 0. 요청 url

```yaml
https://dev.wenivops.co.kr/services/mandarin
```

요청 엔드포인트: https://dev.wenivops.co.kr/services/mandarin

## \* 요청 예시

### -login

```jsx
const url = "https://dev.wenivops.co.kr/services/mandarin";

try {
  const res = await fetch(url + "/user/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: {
        email: emailAddr.value,
        password: pw.value,
      },
    }),
  });
  const resJson = await res.json();
  console.log(resJson);
} catch (err) {
  console.error(err);
}
```

### -image

```jsx
const url = "https://dev.wenivops.co.kr/services/mandarin";

try {
  const response = await fetch(url + "/image/uploadfiles", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  for (let i of data) {
    name.push(i["filename"]);
  }

  if (name.length > 1) {
    return name.join(",");
  } else {
    return name[0];
  }
} catch (err) {
  console.error(err);
}
```

# 1. 이미지

프로필 등록, 프로필 수정, 상품 등록 페이지 등 이미지 등록이 필요한 페이지에서 사용하는 API입니다. 이미지 등록이 필요한 페이지에서는 우선 서버에 이미지를 전송하면 숫자로 이루어진 filename을 포함하는 응답을 받을 수 있습니다. 그 filename을 다른 정보와 함께 서버에 전송해 줍니다.

**\*10MB 이상의 이미지는 업로드 할 수 없습니다.**

**예시 ) 프로필 등록 페이지에서의 사용 방법**

1. 이미지를 서버에 전송합니다. (POST /image/uploadfile)
2. 숫자로 이루어진 filename을 응답받습니다. (2.png → 1640066364747.png)
3. 다른 정보와 함께 서버에 전송합니다. (POST /user)

   filename은 “image”에 문자열로 전송합니다.

   ```json
   {
   		"user": {
   				"_id": String,
   				"email": String,
   				"hearts": [],
   				"isfollow": [],
   				"following": [],
   				"follower": [],
   				"password": String,
   				"username": String,
   				"accountname": String,
   				"intro": String,
   				"image": String // 예시) https://mandarin.api.weniv.co.kr/filename.확장자
   		}
   }
   ```

## 1.1 한 개의 이미지(프로필, 상품)

### API

```jsx
POST / image / uploadfile;
```

### Req

```json
key(name) : image
value : 이미지 파일(*.jpg, *.gif, *.png, *.jpeg, *.bmp, *.tif, *.heic)
//formdata의 키와 벨류를 의미합니다.
```

```json
{
  "Content-type": "multipart/form-data"
}
```

### Res

```json
// SUCCESS
{
		"message": "이미지 업로드 성공",
		"info": {
			"fieldname": "image",
			"originalname": "2.png",
			"encoding": "7bit",
			"mimetype": "image/png",
			"destination": "uploadFiles/",
			"filename": "1640066364747.png",
			"path": "uploadFiles/1640066364747.png",
			"size": 47406
		}
}

// FAIL
// 이미지 파일(*.jpg, *.gif, *.png, *.jpeg, *.bmp, *.tif) 확장자명이 다를 때
이미지 파일만 업로드가 가능합니다.
```

## 1.2 여러개의 이미지(포스트)

### API

여러 이미지는 3개까지 받을 수 있습니다.

```json
POST /image/uploadfiles
```

### Req

```json
key : image
value : 이미지 파일(*.jpg, *.gif, *.png, *.jpeg, *.bmp, *.tif, *.heic)
```

```json
{
	"Content-type" : "multipart/form-data"

```

### Res

```json
*// SUCCESS
{
		"message": "이미지 업로드 성공",
		"info": [
			{
				"fieldname": "image",
				"originalname": "2.png",
				"encoding": "7bit",
				"mimetype": "image/png",
				"destination": "uploadFiles/",
				"filename": "1640066364747.png",
				"path": "uploadFiles/1640066364747.png",
				"size": 47406
			},
			{
				"fieldname": "image",
				"originalname": "2.png",
				"encoding": "7bit",
				"mimetype": "image/png",
				"destination": "uploadFiles/",
				"filename": "1640066364747.png",
				"path": "uploadFiles/1640066364747.png",
				"size": 47406
			}
		]
}

// FAIL
// 이미지 파일(*.jpg, *.gif, *.png, *.jpeg, *.bmp, *.tif) 확장자명이 다를 때
이미지 파일만 업로드가 가능합니다.*
```

## 1.3 이미지 보기

### API

```jsx
GET`https://dev.wenivops.co.kr/services/mandarin/${filename}`;
```

### 사용 방법

서버에서 받은 **파일명과 확장자**를 그대로 URL 뒤에 붙여 사용합니다.

```jsx
예) https://dev.wenivops.co.kr/services/mandarin/1640066364747.png
```

### Res

```json
// SUCCESS
```

![2.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/eb8546f1-3d62-4faa-9954-7b04040bf48f/2.png)

```json
// FAIL
{
  "status": 404
}
```

# 2. 유저

## 2.1 회원 가입

### API

```jsx
POST / user;
```

### Req

```json
{
		"user": {
				"username": String*,
				"email": String*,
				"password": String*,
				"accountname": String*,
				"intro": String,
				"image": String // 예시) https://dev.wenivops.co.kr/services/mandarin/1641906557953.png
		}
}
```

```json
{
  "Content-type": "application/json"
}
```

- email, password, accountname, username 은 필수로 작성해야 합니다.
- email은 이메일 형식에 맞게 작성해야 합니다.
- accountname은 영문자, 숫자, 점(.), 밑줄(\_)만 포함해야 합니다.
- image가 없을 경우((image에 빈 문자열이 들어가면 기본 이미지가 적용됩니다.
  - https://dev.wenivops.co.kr/services/mandarin/Ellipse.png

### Res

```json
// SUCCESS
{
    "message": "회원가입 성공",
    "user": {
    		"accountname": String,
    		"email": String,
    		"image": String,
    		"intro": String,
		    "username": String,
		    "_id": String,
    }
}

// FAIL
// email, password, accountname, username 중 하나라도 작성하지 않을 경우
필수 입력사항을 입력해주세요.
// password를 6자 이상 입력하지 않을 경우
비밀번호는 6자 이상이어야 합니다.
// eamil 형식이 잘못될 경우
잘못된 이메일 형식입니다.
// 가입된 email일 경우
이미 가입된 이메일 주소입니다.
// accountname에 지정된 문자 이외의 문자가 들어갈 경우
영문, 숫자, 밑줄, 마침표만 사용할 수 있습니다.
// 가입된 accountname일 경우
이미 사용중인 계정 ID입니다.
```

## 2.2 로그인

### API

```jsx
POST / user / login;
```

### Req

```json
{
		"user":{
				"email": String*,
				"password": String*
		}
}
```

```json
{
  "Content-type": "application/json"
}
```

- email, password은 필수로 작성해야 합니다.

### Res

```json
// SUCCESS
{
    "_id": String,
    "username": String,
    "email": String,
    "accountname": String,
    "intro": String,
    "image": String,
    "refreshToken": String,
    "token": String
}

// FAIL
// email, password를 입력하지 않을 때
이메일 또는 비밀번호를 입력해주세요.
// email를 입력하지 않을 때
이메일을 입력해주세요.
// password를 입력하지 않을 때
비밀번호를 입력해주세요.
// email, password를 일치하지 않을 때
{
    "message": "이메일 또는 비밀번호가 일치하지 않습니다.",
    "status": 422
}
```

## 2.3 이메일 검증

### API

```jsx
POST / user / emailvalid;
```

### Req

```json
{
		"user":{
				"email": String
		}
}
```

```json
{
  "Content-type": "application/json"
}
```

### Res

```json
// SUCCESS
// 사용 가능한 이메일인 경우
{
    "message": "사용 가능한 이메일 입니다."
}

// 가입한 이메일이 있는 경우
{
    "message": "이미 가입된 이메일 주소 입니다."
}

// 빈 값일 경우
{
    "message": "잘못된 접근입니다."
}

// FAIL (잘못된 형식일 경우)
{
		"message": :"잘못된 이메일 형식입니다.",
		"status": 422
}
```

## 2.4 계정 검증

### API

```jsx
POST / user / accountnamevalid;
```

### Req

```json
{
		"user":{
				"accountname": String
		}
}
```

```json
{
  "Content-type": "application/json"
}
```

### Res

```json
// SUCCESS
// 사용 가능한 계정ID인 경우
{
    "message": "사용 가능한 계정ID 입니다."
}
// 가입한 계정ID가 있는 경우
{
    "message": "이미 가입된 계정ID 입니다."
}

// FAIL
{
    "message": "잘못된 접근입니다."
}
```

# 3. 프로필

## 2.3 마이 프로필 정보 불러오기

### API

```jsx
GET / user / myinfo;
```

### Req

```jsx
{
	"Authorization" : "Bearer {token}"
}
```

### Res

```json
// SUCCESS

	{
	    "user": {
	        "_id": String,
	        "username": String,
	        "accountname": String,
	        "intro": String,
	        "image": String,
	        "isfollow": false,
	        "following": [],
	        "follower": [],
	        "followerCount": 0,
	        "followingCount": 0
	    }
	}

```

## 3.2 마이 프로필 수정

### API

```
PUT /user
```

### Req

```json
{
		"user":{
				"username": String,
				"accountname": String,
				"intro": String,
				"image": String
		}
}
```

```json
{
  "Authorization": "Bearer {token}",
  "Content-type": "application/json"
}
```

### Res

```json
// SUCCESS
{
    "user": {
        "_id": String,
        "username": String,
        "accountname": String,
        "intro": String,
        "image": String,
        "following": [],
        "follower": [],
        "followerCount": Number,
        "followingCount": Number
    }
}

// FAIL
// 이미 사용중인 accountname일 경우
{
    "message": "이미 사용중인 계정 ID입니다.",
    "error": "Conflict",
    "statusCode": 409
}

// 잘못된 토큰 사용한 경우
{
		"message": "유효하지 않은 토큰입니다.",
		"status": 401
}
```

## 3.2 유저 프로필 정보 불러오기

### API

```jsx
GET /profile/:accountname
```

### Req

```jsx
{
	"Authorization" : `Bearer ${token}`,
	"Content-type" : "application/json"
}
```

### Res

```json
// SUCCESS
{
    "profile": {
        "_id": String,
        "username": String,
        "accountname": String,
        "intro": String,
        "image": String,
        "following": [],
        "follower": [],
        "followerCount": Number,
        "followingCount": Number,
        "isfollow": Boolean,
    }
}

// FAIL
// 계정이 존재하지 않을 때
{
		"message": '해당 계정이 존재하지 않습니다.',
		"status": 404
}
```

![스크린샷 2025-09-15 14.36.19.png](attachment:b8632246-09f3-469e-8fe4-efd00a8496e7:스크린샷_2025-09-15_14.36.19.png)

![스크린샷 2025-09-15 14.37.00.png](attachment:e78a2587-98cb-4720-acca-da5ea9cfa034:스크린샷_2025-09-15_14.37.00.png)

## 3.3 팔로우

### API

```
POST profile/:accountname/follow
```

### Req

```json
{
  "Authorization": "Bearer {token}",
  "Content-type": "application/json"
}
```

### Res

```json
// SUCCESS
// follow 한 사용자의 프로필
{
    "profile": {
        "_id": String,
        "username": String,
        "accountname": String,
        "intro": String,
        "image": String,
        "isfollow": true,
        "following": [],
        "follower": [
            ..., "접속한 사용자의 id"
        ],
        "followerCount": +1,
        "followingCount": 0,
    }
}

// FAIL
// 계정이 존재하지 않을 때
{
    "message": "해당 계정이 존재하지 않습니다.",
    "error": "Not Found",
    "statusCode": 404
}

// 자신을 팔로우하려 할 때
{
    "message": "자기 자신을 팔로우 할 수 없습니다."
}

// 잘못된 토큰으로 팔로우 할 때
{
    "message": "유효하지 않은 토큰입니다.",
    "status": 401
}
```

## 3.4 언팔로우

### API

```jsx
DELETE profile/:accountname/unfollow
```

### Req

```json
{
  "Authorization": "Bearer {token}",
  "Content-type": "application/json"
}
```

### Res

```json
// SUCCESS
// unfollow 한 사용자의 프로필
{
    "profile": {
        "_id": String,
        "username": String,
        "accountname": String,
        "intro": String,
        "image": String,
        "isfollow": false,
        "following": [],
        "follower": [],
        "followerCount": 0,
        "followingCount": 0
    }
}

// FAIL
// 계정이 존재하지 않을 때
{
    "message": "해당 계정이 존재하지 않습니다.",
    "error": "Not Found",
    "statusCode": 404
}

// 유효하지 않은 토큰일 경우
{
    "message": "유효하지 않은 토큰입니다.",
    "status": 401
}
```

![스크린샷 2025-09-15 14.57.25.png](attachment:4afd11e2-1a0b-4a34-bdf4-71b8e4a48040:스크린샷_2025-09-15_14.57.25.png)

## 3.5 팔로잉 리스트(유저가 팔로우한 사용자 목록)

### API

```jsx
GET profile/:accountname/following

// paging limit skip
GET /profile/:accountname/following?limit=**Number**&skip=**Number**
```

### Req

```jsx
{
	"Authorization" : `Bearer ${token}`,
	"Content-type" : "application/json"
}
```

### Res

```json
// SUCCESS
// following 한 사용자가 있을 때
[
		{
        "_id": String,
        "username": String,
        "accountname": String,
        "intro": String,
        "image": String,
        "isfollow": Boolean,
        "following": [],
        "follower": [],
        "followerCount": Number,
        "followingCount": Number,
    }
]

// FAIL
// following 한 사용자가 없을 때
{
    "message": "팔로잉 목록이 존재하지 않습니다.",
    "error": "Not Found",
    "statusCode": 404
}

// 계정이 존재하지 않을 때
{
    "message": "해당 계정이 존재하지 않습니다.",
    "status": 404
}

// 잘못된 토큰으로 조회
{
    "message": "유효하지 않은 토큰입니다.",
    "status": 401
}
```

## 3.6 팔로워 리스트(유저를 팔로우한 사용자 목록)

### API

```jsx
GET profile/:accountname/follower

// paging limit skip
GET /profile/:accountname/follower/?limit=**Number**&skip=**Number**
```

### Req

```jsx
{
	"Authorization" : `Bearer ${token}`,
	"Content-type" : "application/json"
}
```

### Res

```json
// SUCCESS
// 해당 유저를 follow 한 사용자가 있을 때
[
		{
        "_id": String,
        "username": String,
        "accountname": String,
        "intro": String,
        "image": String,
        "isfollow": Boolean,
        "following": [],
        "follower": [
            "해당 유저를 follow 한 사용자의 id"
        ],
        "followerCount": Number,
        "followingCount": Number,
    }
]

// FAIL
// 해당 유저를 follow 한 사용자가 없을 때
{
    "message": "팔로워 목록이 존재하지 않습니다.",
    "error": "Not Found",
    "statusCode": 404
}

// 계정이 존재하지 않을 때
{
    "message": "해당 계정이 존재하지 않습니다.",
    "status": 404
}

// 잘못된 토큰으로 조회한 경우
{
    "message": "유효하지 않은 토큰입니다.",
    "status": 401
}
```

# 4. 검색

## 4.1 유저 검색

### API

```
GET /user/searchuser/?keyword=**keyword**
```

- **keyword**에 검색어를 입력합니다.
- keyword에는 accountname, username을 검색할 수 있습니다.

### Req

```jsx
{
	"Authorization" : `Bearer ${token}`,
	"Content-type" : "application/json"
}
```

### Res

```json
// SUCCESS
[
    {
        "_id": String,
        "username": String,
        "accountname": String,
        "intro": String,
        "image": String,
        "isfollow": Boolean,
        "following": [],
        "follower": [],
        "followerCount": Number,
        "followingCount": Number
    },
    .
    .
    .
]

// FAIL
// 존재하지 않는 키워드일 경우
{
    "message": "사용자를 찾을 수 없습니다.",
    "error": "Not Found",
    "statusCode": 404
}

// 빈 문자열 혹은 공백으로 검색할 경우
{
    "message": "검색어를 입력해주세요.",
    "error": "Bad Request",
    "statusCode": 400
}

// 잘못된 토큰으로 검색할 경우
{
    "message": "유효하지 않은 토큰입니다.",
    "status": 401
}
```

# 5. 게시글

## 5.1 게시글 작성

### API

```
POST /post
```

### Req

```json
{
    "post": {
				"content": String,
				"image": String
		}
}
```

```jsx
{
	"Authorization" : `Bearer ${token}`,
	"Content-type" : "application/json"
}
```

### Res

```json
// SUCCESS
{
    "post": [
        {
            "id": String,
            "content": Strin,
            "image": String,
            "createdAt": String,
            "updatedAt": String,
            "hearted": false,
            "heartCount": 0,
            "commentCount": 0,
            "author": {
                "_id": "작성자 id",
                "username": "2",
                "accountname": "2",
                "intro": String,
                "image": String,
                "isfollow": Boolean,
                "following": [],
                "follower": [],
                "followerCount": Number,
                "followingCount": Number,
            }
        }
    ]
}

// FAIL
// 내용과 이미지 모두 입력하지 않을 때
{
    "message": "내용 또는 이미지를 입력해주세요.",
    "status": 422
}

// 잘못된 토큰으로 작성한 경우
{
    "message": "유효하지 않은 토큰입니다.",
    "status": 401
}
```

## 5.2 팔로잉 게시글 목록(피드)

**팔로우 한 사용자가 탈퇴했을 경우에는 예외처리 안됨**

<aside>
🍊 내가 팔로우하고 있는 유저의 게시글 목록입니다.

</aside>

### API

```jsx
GET /post/feed

// paging limit skip
GET /post/feed/?limit=**Number**&skip=**Number**
```

### Req

```json
{
  "Authorization": "Bearer {token}",
  "Content-type": "application/json"
}
```

### Res

```json
// SUCCESS
// 내가 follow 한 사용자가 있고, 해당 사용자가 작성한 게시글이 있을 때
{
    "posts": [
        {
            "id": String,
            "content": String,
            "image": String,
            "createdAt": String,
            "updatedAt": String,
            "hearted": Boolean,
            "heartCount": Number,
             "comments": [],
            "commentCount": Number,
            "author": {
                "_id": String,
                "username": String,
                "accountname": String,
                "intro": String,
                "image": String,
                "isfollow": Boolean
                "following": [],
                "follower": [,
                "followerCount": Number,
                "followingCount": Number,
            }
        },
        .
        .
        .
    ]
}

// follow 한 사용자가 없거나, 작성된 게시글이 없을 때
{
    "posts": []
}

// FAIL
// 잘못된 토큰으로 작성한 경우
{
    "message": "유효하지 않은 토큰입니다.",
    "status": 401
}
```

## 5.3 유저별 게시글 목록

### API

```json
GET /post/:accountname/userpost

// paging limit skip
GET /post/:accountname/userpost/?limit=Number&skip=Number
```

### Req

```json
{
  "Authorization": "Bearer {token}",
  "Content-type": "application/json"
}
```

### Res

```json
// SUCCESS
{
    "post": [
        {
            "id": String,
            "content": String,
            "image": String,
            "createdAt": String,
            "updatedAt": String,
            "hearted": Boolean,
            "heartCount": Number,
             "comments": [],
            "commentCount": Number,
            "author": {
                "_id": String,
                "username": String,
                "accountname": String,
                "intro": String,
                "image": String,
                "isfollow": Boolean
                "following": [],
                "follower": [,
                "followerCount": Number,
                "followingCount": Number,
            }
        },
        .
        .
        .
    ]
}
// 해당 계정의 게시물이 존재하지 않을 때
{
		"post":[]
}

// FAIL
// 해당 계정이 존재하지 않을 때
{
    "message": "해당 계정이 존재하지 않습니다.",
    "status": 404
}

// 잘못된 토큰으로 작성한 경우
{
    "message": "유효하지 않은 토큰입니다.",
    "status": 401
}
```

## 5.4 게시글 상세

### API

```jsx
GET /post/:post_id
```

### Req

```json
{
  "Authorization": "Bearer {token}",
  "Content-type": "application/json"
}
```

### Res

```json
// SUCCESS
{
    "post": {
        "id": String,
        "content": String
        "image": String,
        "createdAt": String,
        "updatedAt": String,
        "hearted": Boolean,
        "heartCount": Number,
        "comments": [],
        "commentCount": Number,
        "author": {
            "_id": String,
            "username": String,
            "accountname": String,
            "intro": String
            "image": String,
            "isfollow": Boolean,
            "following": [],
            "follower": [],
            "followerCount": Number,
            "followingCount": Number,
        }
    }
}

// FAIL
// 존재하지 않는 게시글 조회
{
    "message": "유효하지 않은 게시글 ID입니다.",
    "status": 404
}

// 잘못된 토큰으로 작성한 경우
{
    "message": "유효하지 않은 토큰입니다.",
    "status": 401
}
```

## 5.5 게시글 수정

### API

```jsx
PUT /post/:post_id
```

### Req

```json
{
    "post": {
				"content": String,
				"image": String
		}
}
```

```json
{
  "Authorization": "Bearer {token}",
  "Content-type": "application/json"
}
```

### Res

```json
// SUCCESS
{
    "post": {
        "id": String,
        "content": String
        "image": String,
        "createdAt": String,
        "updatedAt": String,
        "hearted": Boolean,
        "heartCount": Number,
        "comments": [],
        "commentCount": Number,
        "author": {
            "_id": String,
            "username": String,
            "accountname": String,
            "intro": String
            "image": String,
            "isfollow": Boolean,
            "following": [],
            "follower": [],
            "followerCount": Number,
            "followingCount": Number,
        }
    }
}

// FAIL
// 게시글이 존재하지 않을 때
{
    "message": "유효하지 않은 게시글 ID입니다.",
    "status": 404
}

// 다른 사용자의 게시글을 수정할 경우
{
    "message": "잘못된 요청입니다. 로그인 정보를 확인하세요",
    "status": 403
}

// 토큰이 유효하지 않을 경우
{
    "message": "유효하지 않은 토큰입니다.",
    "status": 401
}
```

## 5.6 게시글 삭제

### API

```jsx
DELETE /post/:post_id
```

### Req

```json
{
  "Authorization": "Bearer {token}",
  "Content-type": "application/json"
}
```

### Res

```json
// SUCCESS
{
    "message": "삭제되었습니다.",
    "status": 200
}

// FAIL
// 게시글이 존재하지 않을 때
{
    "message": "유효하지 않은 게시글 ID입니다.",
    "status": 404
}

// 다른 사용자의 게시물을 삭제할 경우
{
    "message": "잘못된 요청입니다. 로그인 정보를 확인하세요",
    "status": 403
}

// 토큰이 유효하지 않을 경우
{
    "message": "유효하지 않은 토큰입니다.",
    "status": 401
}
```

## 5.7 게시글 신고

### API

```jsx
POST /post/:post_id/report
```

### Req

```json
{
  "Authorization": "Bearer {token}",
  "Content-type": "application/json"
}
```

### Res

```json
// SUCCESS
{
    "report": {
        "post": String,
        "createdAt": String,
    }
}

// FAIL
// 게시글이 존재하지 않을 때
{
    "message": "유효하지 않은 게시글 ID입니다.",
    "status": 404
}

// 토큰이 유효하지 않을 경우
{
    "message": "유효하지 않은 토큰입니다.",
    "status": 401
}
```

## 5.8 게시글 전체보기

### API

```jsx
GET /post
GET /post?limit=**Number**&skip=**Number**
```

### Req

```jsx
{
	"Authorization" : `Bearer ${token}`,
  "Content-type" : "application/json"
}
```

### Res

```json
// SUCCESS
{
    "posts": [
        {
            "id": String,
            "content": String,
            "image": String,
            "comments": [],

            "author": {
                "_id": String,
                "username": String,
                "image": String,
                "email": String,
                "accountname": String,
                "intro": String,
                "hearts": [],
                "following": [],
                "follower": [,
                "followerCount": Number,
                "followingCount": Number,
            }
        },
        .
        .
        .
    ]
}

// FAIL
// 토큰이 유효하지 않을 경우
{
    "message": "유효하지 않은 토큰입니다.",
    "status": 401
}
```

# 6. 좋아요

## 6.1 좋아요

<aside>
📌

좋아요 요청을 두번 보내면 좋아요가 취소됩니다.

</aside>

### API

```jsx
POST /post/:post_id/heart
```

### Req

```json
{
  "Authorization": "Bearer {token}",
  "Content-type": "application/json"
}
```

### Res

```json
// SUCCESS
{
    "post": {
        "id": String,
        "content": String,
        "image": String,
        "createdAt": String,
        "updatedAt": String,
        "hearted": Boolean,
        "heartCount": Number,
        "comments": [],
        "commentCount": Number,
        "author": {
            "_id": String,
            "username": String,
            "accountname": String,
            "intro": String,
            "image": String,
            "isfollow": Boolean,
            "following": [],
            "follower": [],
            "followerCount": Number,
            "followingCount": Number,
        }
    }
}

// FAIL
// 게시글이 존재하지 않을 때
{
    "message": "유효하지 않은 게시글 ID입니다.",
    "status": 404
}

// 토큰이 유효하지 않을 경우
{
    "message": "유효하지 않은 토큰입니다.",
    "status": 401
}
```

## 6.2 좋아요 취소

<aside>
📌

좋아요 취소 요청을 두번 보내면 좋아요가 됩니다.

</aside>

### API

```jsx
DELETE /post/:post_id/unheart
```

### Res

```json
// SUCCESS
{
    "post": {
        "id": String,
        "content": String,
        "image": String,
        "createdAt": String,
        "updatedAt": String,
        "hearted": Boolean,
        "heartCount": Number,
        "comments": [],
        "commentCount": Number,
        "author": {
            "_id": String,
            "username": String,
            "accountname": String,
            "intro": String,
            "image": String,
            "isfollow": Boolean,
            "following": [],
            "follower": [],
            "followerCount": Number,
            "followingCount": Number,
        }
    }
}

// FAIL
// 게시글이 존재하지 않을 때
{
    "message": "유효하지 않은 게시글 ID입니다.",
    "status": 404
}

// 토큰이 유효하지 않을 경우
{
    "message": "유효하지 않은 토큰입니다.",
    "status": 401
}
```

# 7. 댓글

## 7.1 댓글 작성

### API

```jsx
POST /post/:post_id/comments
```

### Req

```json
{
    "comment":{
        "content":String
    }
}
```

```json
{
  "Authorization": "Bearer {token}",
  "Content-type": "application/json"
}
```

### Res

```json
// SUCCESS
{
    "comment": {
        "id": String,
        "content": String,
        "createdAt": String,
        "author": {
            "_id": String,
            "username": String,
            "accountname": String,
            "intro": String,
            "image": String,
            "isflollow": Boolean,
            "following": [],
            "follower": [],
            "followerCount": Number,
            "followingCount": Number,
        }
    }
}

// FAIL
// 게시물이 존재하지 않을 때
{
    "message": "유효하지 않은 게시글 ID입니다.",
    "status": 404
}

// 댓글을 입력하지 않을 때
댓글을 입력해주세요.

// 토큰이 유효하지 않을 경우
{
    "message": "유효하지 않은 토큰입니다.",
    "status": 401
}
```

## 7.2 댓글 리스트

### API

```jsx
// 기본값은 10개만 불러옵니다.
GET /post/:post_id/comments

// paging limit skip
GET /post/:post_id/comments/?limit=**Number**&skip=**Number**
```

### Req

```json
{
  "Authorization": "Bearer {token}",
  "Content-type": "application/json"
}
```

### Res

```json
// SUCCESS
// 댓글이 존재하는 경우
{
    "comment": [
        {
            "id": String,
            "content": String,
            "createdAt": String,
            "author": {
                "_id": String,
                "username": String,
                "accountname": String,
                "intro": String,
                "image": String,
                "isfollow": Boolean,
                "following": [],
                "follower": [],
                "followerCount": Number,
                "followingCount": Number
            }
        },
        .
        .
        .
    ]
}

// 댓글이 존재하지 않는 경우
{
    "comment": []
}

// FAIL
// 게시물이 존재하지 않을 때
{
    "message": "유효하지 않은 게시글 ID입니다.",
    "status": 404
}
```

## 7.3 댓글 삭제

### API

```jsx
DELETE /post/:post_id/comments/:comment_id
```

### Req

```json
{
  "Authorization": "Bearer {token}",
  "Content-type": "application/json"
}
```

### Res

```json
// SUCCESS
{
    "message": "댓글이 삭제되었습니다.",
    "status": 200
}

// FAIL
// 게시글이 존재하지 않을 때
{
    "message": "유효하지 않은 게시글 ID입니다.",
    "status": 404
}

// 댓글이 존재하지 않을 때
{
    "message": "댓글이 존재하지 않습니다.",
    "status": 404
}

// 다른 사용자의 댓글 삭제를 시도할 때
{
    "message": "댓글 작성자만 댓글을 삭제할 수 있습니다.",
    "status": 403
}

// 토큰이 유효하지 않을 경우
{
    "message": "유효하지 않은 토큰입니다.",
    "status": 401
}
```

## 7.4 댓글 신고

### API

```jsx
POST /post/:post_id/comments/:comment_id/report
```

### Req

```json
{
  "Authorization": "Bearer {token}",
  "Content-type": "application/json"
}
```

### Res

```json
// SUCCESS
{
    "report": {
        "comment": String,
        "createdAt": String
    }
}

// FAIL
// 게시글이 존재하지 않을 때
{
    "message": "유효하지 않은 게시글 ID입니다.",
    "status": 404
}

// 댓글이 존재하지 않을 때

// 토큰이 유효하지 않을 경우
{
    "message": "유효하지 않은 토큰입니다.",
    "status": 401
}
```

# 8. 상품

## 8.1 상품 등록

### API

```jsx
POST / product;
```

### Req

```json
{
		"product":{
				"itemName": String,
				"price": Number, //1원 이상
				"link": String,
				"itemImage": String
		}
}
```

```json
{
  "Authorization": "Bearer {token}",
  "Content-type": "application/json"
}
```

### Res

```json
// SUCCESS
{
    "product": {
        "id": String,
        "itemName": String
        "price": Number,
        "link": String,
        "itemImage": String,
        "createdAt": String,
        "updatedAt": String,
        "author": {
            "_id": String,
            "username": String,
            "accountname": String,
            "intro": String,
            "image": String,
            "isfollow": Boolean,
            "following": [],
            "follower": [],
            "followerCount": Number,
            "followingCount": Number
        }
    }
}

// FAIL
// itemName, price, link, itemImage 중 하나라도 입력하지 않았을 때 > 필수 입력사항이 뭔지
{
    "message": "필수 입력사항을 입력해주세요.",
    "status": 422
}

// price를 0원 이하로 입력했을 때
{
    "message": "가격은 1원 이상이어야 합니다.",
    "status": 422
}

// price를 String으로 입력했을 때
{
    "message": "가격은 숫자로 입력하셔야 합니다.",
    "status": 422
}

// 토큰이 유효하지 않을 경우
{
    "message": "유효하지 않은 토큰입니다.",
    "status": 401

```

## 8.2 상품 리스트

### API

```jsx
GET /product/:accountname

// paging limit skip
GET /product/:accountname/?limit=**Number**&skip=**Number**
```

### Req

```json
{
  "Authorization": "Bearer {token}",
  "Content-type": "application/json"
}
```

### Res

```json
// SUCCESS
// 상품이 있을 때
{
		"data" : Number,
		"product": [
				{
						"id": String,
						"itemName": String,
						"price": Number,
						"link": String,
						"itemImage": String,
						"createdAt": String,
            "updatedAt": String,
						"author": {
								"_id": String,
								"username": String,
								"accountname": String,
								"intro": String,
								"image": String,
								"isfollow": Boolean,
								"following": [],
								"follower": [],
								"followerCount": Number,
								"followingCount": Number
						}
				},
				.
				.
				.
		]
}

// 상품이 없을 때
{
		"data" : Number,
		"product": []
}

// FAIL
// 존재하지 않는 유저 상품 리스트 조회
{
    "message": "해당 계정이 존재하지 않습니다.",
    "status": 404
}

// 토큰이 유효하지 않을 경우
{
    "message": "유효하지 않은 토큰입니다.",
    "status": 401
}
```

## 8.3 상품 상세

### API

```jsx
GET /product/detail/:product_id
```

### Req

```json
{
  "Authorization": "Bearer {token}",
  "Content-type": "application/json"
}
```

### Res

```json
// SUCCESS
{
    "product": {
        "id": String,
        "itemName": String,
        "price": Number,
        "link": String,
        "itemImage": String,
        "createdAt": String,
        "updatedAt": String,
        "author": {
            "_id": String,
            "username": String,
            "accountname": String,
            "intro": String,
            "image": String,
            "isfollow": Boolean,
            "following": [],
            "follower": [],
            "followerCount": Number,
            "followingCount": Number
        }
    }
}

// FAIL
// 존재하지 않는 상품 상세 조회
{
    "message": "유효하지 않은 상품 ID입니다.",
    "status": 404
}

// 토큰이 유효하지 않을 경우
{
    "message": "유효하지 않은 토큰입니다.",
    "status": 401
}
```

## 8.4 상품 수정

### API

```jsx
PUT /product/:product_id
```

### Req

```json
{
		"product": {
				"itemName": String,
				"price": Number,
				"link": String,
				"itemImage": String
				}
		}
}
```

```json
{
  "Authorization": "Bearer {token}",
  "Content-type": "application/json"
}
```

### Res

```json
// SUCCESS
{
    "product": {
        "id": String,
        "itemName": String,
        "price": Number,
        "link": String,
        "itemImage": String,
        "createdAt": String,
        "updatedAt": String,
        "author": {
            "_id": String,
            "username": String,
            "accountname": String,
            "intro": String,
            "image": String,
            "isfollow": Boolean,
            "following": [],
            "follower": [],
            "followerCount": Number,
            "followingCount": Number
        }
    }
}

// FAIL
// 상품이 없을 때
{
    "message": "유효하지 않은 상품 ID입니다.",
    "status": 404
}

// 타 유저 상품 수정
{
    "message": "잘못된 요청입니다. 로그인 정보를 확인하세요",
    "status": 403
}

// 토큰이 유효하지 않을 경우
{
    "message": "유효하지 않은 토큰입니다.",
    "status": 401
}
```

## 8.5 상품 삭제

### API

```jsx
DELETE /product/:product_id
```

### Req

```json
{
  "Authorization": "Bearer {token}",
  "Content-type": "application/json"
}
```

### Res

```json
// SUCCESS
{
    "message": "삭제되었습니다.",
    "status": 200
}

// FAIL
// 존재하지 않는 상품 삭제
{
    "message": "유효하지 않은 상품 ID입니다.",
    "status": 404
}

// 타 유저 상품 삭제
{
    "message": "잘못된 요청입니다. 로그인 정보를 확인하세요",
    "status": 403
}

// 토큰이 유효하지 않을 경우
{
    "message": "유효하지 않은 토큰입니다.",
    "status": 401
}
```

# 9. 토큰 검증

## API

```jsx
GET user/checktoken
```

### Req

```json
{
  "Authorization": "Bearer {token}",
  "Content-type": "application/json"
}
```

### Res

```json
// 토큰이 유효한 경우
{
		"isValid":true
}

// 토큰이 유효하지않은 경우
{
    "message": "유효하지 않은 토큰입니다.",
    "status": 401
}

// 빈 토큰 검증
{
    "message": "토큰이 없습니다.",
    "status": 401
}
```

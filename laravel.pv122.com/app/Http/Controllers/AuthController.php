<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Validator;
use Symfony\Component\HttpFoundation\Response;

use Storage;

class AuthController extends Controller
{
    public function __construct() {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);

    }

    /**
     * @OA\Post(
     ** path="/api/auth/login",
     *   tags={"Auth"},
     *   summary="Login",
     *   operationId="login",
     *
     *   @OA\Parameter(
     *      name="email",
     *      in="query",
     *      required=true,
     *      @OA\Schema(
     *           type="string"
     *      )
     *   ),
     *   @OA\Parameter(
     *      name="password",
     *      in="query",
     *      required=true,
     *      @OA\Schema(
     *          type="string"
     *      )
     *   ),
     *   @OA\Response(
     *      response=200,
     *       description="Success",
     *      @OA\MediaType(
     *           mediaType="application/json",
     *      )
     *   ),
     *   @OA\Response(
     *      response=401,
     *       description="Unauthenticated"
     *   ),
     *   @OA\Response(
     *      response=400,
     *      description="Bad Request"
     *   ),
     *   @OA\Response(
     *      response=404,
     *      description="not found"
     *   ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      )
     *)
     **/


    public function login(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        if (! $token = auth()->attempt($validator->validated())) {
            return response()->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }
        return $this->createNewToken($token);
    }

    /**
     * @OA\Post(
     *     tags={"Auth"},
     *     path="/api/auth/register",
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"email", "lastName", "name", "phone", "image", "password", "confirmPassword"},
     *                 @OA\Property(
     *                     property="image",
     *                     type="string",
     *                     format="binary"
     *                 ),
     *                 @OA\Property(
     *                     property="email",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="lastName",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="name",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="phone",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="password",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="confirmPassword",
     *                     type="string"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Add Category.")
     * )
     */


    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|min:6',
            'phone' => 'required|string|max:40',
            'image' => 'required|image|max:4096', // Assuming photo is uploaded as an image file
            'lastName' => 'required|string|max:100',
        ]);
        $failsAll = $validator->errors()->toJson();
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), Response::HTTP_BAD_REQUEST);
        }

        $filename = uniqid(). '.' .$request->file("image")->getClientOriginalExtension();
        Storage::disk('local')->put("public/uploads/".$filename,file_get_contents($request->file("image")));

        $user = User::create(array_merge(
            $validator->validated(),
            ['password' => bcrypt($request->password), 'image'=> $filename]
        ));



        return response()->json([
            'message' => 'User successfully registered',
            'user' => $user
        ], Response::HTTP_CREATED);
    }

    /**
     * @OA\Post(
     *     path="/api/auth/logout",
     *     tags={"Auth"},
     *     security={{"apiAuth":{}}},
     *     @OA\Response(response="200", description="Display a listing of projects.")
     * )
     */

    public function logout() {
        auth()->logout();

        return response()->json(['message' => 'User successfully signed out'], Response::HTTP_OK);
    }


    /**
     * @OA\Post(
     *     path="/api/auth/refresh",
     *     tags={"Auth"},
     *     security={{"apiAuth":{}}},
     *     @OA\Response(response="200", description="Display a listing of projects.")
     * )
     */

    public function refresh() {
        return $this->createNewToken(auth()->refresh(), Response::HTTP_OK);
    }


    /**
     * @OA\Get(
     *     path="/api/auth/user-profile",
     *     tags={"Auth"},
     *     security={{"apiAuth":{}}},
     *     @OA\Response(response="200", description="Display a listing of projects.")
     * )
     */

    public function userProfile() {
        return response()->json(auth()->user(), Response::HTTP_OK);
    }

    protected function createNewToken($token){
        return response()->json([
            'access_token' => $token,
//            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
//            'user' => auth()->user()
        ], Response::HTTP_OK);
    }

}
